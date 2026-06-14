"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import { type Listing, formatPrice } from "@/lib/listings";

const PIN = (color: string) =>
  `<svg width="30" height="42" viewBox="0 0 26 36" xmlns="http://www.w3.org/2000/svg"><path d="M13 0C5.82 0 0 5.82 0 13c0 8.84 13 23 13 23s13-14.16 13-23C26 5.82 20.18 0 13 0z" fill="${color}"/><circle cx="13" cy="13" r="4.6" fill="#f8f4ed"/></svg>`;

/** Brand styling for Leaflet controls, markers and popups — injected once. */
const STYLE_ID = "mvp-map-style";
const CSS = `
.mvp-pin{filter:drop-shadow(0 4px 7px rgba(20,14,10,.5));}
.mvp-pin svg{transition:transform .22s cubic-bezier(.22,1,.36,1);transform-origin:50% 100%;}
.mvp-pin:hover{z-index:1200 !important;}
.mvp-pin:hover svg{transform:scale(1.22);}
.mvp-map .leaflet-bar{border:0;border-radius:14px;overflow:hidden;box-shadow:0 8px 24px -10px rgba(33,24,20,.55);}
.mvp-map .leaflet-bar a{background:rgba(248,244,237,.96);color:#211814;border-bottom-color:rgba(33,24,20,.1);width:34px;height:34px;line-height:34px;font-size:18px;}
.mvp-map .leaflet-bar a:hover{background:#fff;color:#6f5125;}
.mvp-toggle{display:flex;gap:2px;padding:3px;border-radius:999px;background:rgba(248,244,237,.92);
  -webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);border:1px solid rgba(33,24,20,.12);
  box-shadow:0 8px 24px -10px rgba(33,24,20,.5);font-family:ui-sans-serif,system-ui,sans-serif;}
.mvp-toggle button{border:0;cursor:pointer;background:transparent;color:#6b5e52;padding:6px 14px;border-radius:999px;
  font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;transition:all .25s ease;}
.mvp-toggle button.active{background:#211814;color:#f8f4ed;}
.mvp-count{font-family:ui-sans-serif,system-ui,sans-serif;font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;
  color:#211814;background:rgba(248,244,237,.92);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);
  border:1px solid rgba(33,24,20,.12);border-radius:999px;padding:7px 15px;box-shadow:0 8px 24px -10px rgba(33,24,20,.5);}
.mvp-count b{color:#8a6736;}
.mvp-map .leaflet-popup-content-wrapper{border-radius:16px;padding:0;overflow:hidden;
  box-shadow:0 24px 60px -22px rgba(20,14,10,.6);border:1px solid rgba(33,24,20,.08);}
.mvp-map .leaflet-popup-content{margin:0;width:236px !important;font-family:ui-sans-serif,system-ui,sans-serif;}
.mvp-map .leaflet-popup-tip{box-shadow:0 24px 60px -22px rgba(20,14,10,.6);}
.mvp-pop-img{display:block;width:100%;height:124px;object-fit:cover;background:#e8e1d6;}
.mvp-pop-body{padding:12px 15px 14px;}
.mvp-pop-title{font-size:15px;line-height:1.25;color:#211814;font-weight:600;}
.mvp-pop-loc{font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:#9a8c7d;margin-top:5px;}
.mvp-pop-price{font-size:18px;color:#6f5125;font-weight:700;margin-top:7px;}
.mvp-pop-meta{font-size:12.5px;color:#6b5e52;margin-top:3px;}
.mvp-pop-cta{display:inline-flex;align-items:center;gap:5px;margin-top:11px;padding:7px 14px;border-radius:999px;
  background:#211814;color:#f8f4ed;font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;text-decoration:none;
  transition:background .25s ease;}
.mvp-pop-cta:hover{background:#8a6736;}
.mvp-map .leaflet-popup-close-button{color:#fff;top:7px;right:8px;width:22px;height:22px;font-size:20px;
  background:rgba(20,14,10,.45);border-radius:999px;line-height:20px;}
.mvp-map .leaflet-control-attribution{font-size:9px;background:rgba(248,244,237,.7);}
`;

function injectStyle() {
  if (typeof document === "undefined" || document.getElementById(STYLE_ID)) return;
  const tag = document.createElement("style");
  tag.id = STYLE_ID;
  tag.textContent = CSS;
  document.head.appendChild(tag);
}

export default function ListingsMap({ listings }: { listings: Listing[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const made = useRef(false);

  useEffect(() => {
    if (made.current || !ref.current) return;
    made.current = true;
    injectStyle();
    let map: import("leaflet").Map | undefined;

    (async () => {
      const L = (await import("leaflet")).default;
      if (!ref.current) return;

      map = L.map(ref.current, {
        scrollWheelZoom: false,
        attributionControl: true,
        minZoom: 9,
        maxBounds: L.latLngBounds([20.85, -157.55], [21.45, -156.55]),
        maxBoundsViscosity: 0.6,
      });

      // Base layers (no API key required)
      const satellite = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        { maxZoom: 18, attribution: "Imagery &copy; Esri, Maxar, Earthstar Geographics" },
      );
      const labels = L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png",
        { maxZoom: 19, attribution: "&copy; CARTO" },
      );
      const streets = L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        {
          maxZoom: 19,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        },
      );

      // Default: satellite + place labels
      satellite.addTo(map);
      labels.addTo(map);

      const setView = (view: "sat" | "map") => {
        if (!map) return;
        if (view === "sat") {
          if (map.hasLayer(streets)) map.removeLayer(streets);
          if (!map.hasLayer(satellite)) satellite.addTo(map);
          if (!map.hasLayer(labels)) labels.addTo(map);
        } else {
          if (map.hasLayer(satellite)) map.removeLayer(satellite);
          if (map.hasLayer(labels)) map.removeLayer(labels);
          if (!map.hasLayer(streets)) streets.addTo(map);
        }
      };

      // Custom Map / Satellite toggle
      const Toggle = L.Control.extend({
        options: { position: "topright" as L.ControlPosition },
        onAdd() {
          const div = L.DomUtil.create("div", "mvp-toggle");
          div.innerHTML =
            '<button data-v="sat" class="active">Satellite</button><button data-v="map">Map</button>';
          L.DomEvent.disableClickPropagation(div);
          div.addEventListener("click", (e) => {
            const btn = (e.target as HTMLElement).closest("button");
            const v = btn?.getAttribute("data-v") as "sat" | "map" | null;
            if (!v) return;
            setView(v);
            div.querySelectorAll("button").forEach((b) =>
              b.classList.toggle("active", b.getAttribute("data-v") === v),
            );
          });
          return div;
        },
      });
      map.addControl(new Toggle());

      // Listing count badge
      const pinned = listings.filter(
        (l) => typeof l.lat === "number" && typeof l.lng === "number",
      );
      if (pinned.length) {
        const Count = L.Control.extend({
          options: { position: "bottomleft" as L.ControlPosition },
          onAdd() {
            const div = L.DomUtil.create("div", "mvp-count");
            div.innerHTML = `<b>${pinned.length}</b> listings on Molokaʻi`;
            return div;
          },
        });
        map.addControl(new Count());
      }

      const icon = L.divIcon({
        className: "mvp-pin",
        html: PIN("#8a6736"),
        iconSize: [30, 42],
        iconAnchor: [15, 42],
        popupAnchor: [0, -38],
      });

      const pts: [number, number][] = [];
      for (const l of pinned) {
        pts.push([l.lat as number, l.lng as number]);
        const meta = [
          l.beds > 0 ? `${l.beds} bd` : null,
          l.baths > 0 ? `${l.baths} ba` : null,
          l.sqft > 0 ? `${l.sqft.toLocaleString()} sqft` : null,
        ].filter(Boolean).join(" · ");
        L.marker([l.lat as number, l.lng as number], { icon, title: l.title })
          .addTo(map!)
          .bindPopup(
            `<img class="mvp-pop-img" src="${l.image}" alt="" loading="lazy" onerror="this.style.display='none'"/>
             <div class="mvp-pop-body">
               <div class="mvp-pop-title">${l.title}</div>
               <div class="mvp-pop-loc">${l.city}, HI · ${l.area}</div>
               <div class="mvp-pop-price">${formatPrice(l.price)}</div>
               ${meta ? `<div class="mvp-pop-meta">${meta}</div>` : `<div class="mvp-pop-meta">${l.type}</div>`}
               <a class="mvp-pop-cta" href="${l.ramUrl ?? "#"}" target="_blank" rel="noopener noreferrer">View on MLS &rarr;</a>
             </div>`,
            { maxWidth: 236, closeButton: true },
          );
      }

      if (pts.length > 1) {
        map.fitBounds(pts, { padding: [60, 60] });
      } else if (pts.length === 1) {
        map.setView(pts[0], 13);
      } else {
        map.setView([21.13, -157.02], 11);
      }

      // Enable scroll-zoom only after the user clicks into the map.
      map.on("click", () => map?.scrollWheelZoom.enable());
      map.on("mouseout", () => map?.scrollWheelZoom.disable());
    })();

    return () => {
      map?.remove();
      made.current = false;
    };
  }, [listings]);

  return (
    <div
      ref={ref}
      role="application"
      aria-label="Map of Molokaʻi listings"
      className="mvp-map h-[460px] w-full overflow-hidden rounded-3xl border border-ink/10 shadow-[0_30px_80px_-40px_rgba(33,24,20,0.4)] sm:h-[560px]"
    />
  );
}
