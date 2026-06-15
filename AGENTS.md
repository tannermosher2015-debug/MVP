<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Real Estate on Molokai — project rules

Real estate website, live at https://real-estate-on-molokai.vercel.app.

## Stack
**Next.js 16.2.7** (App Router, Turbopack), `next/font` for **Cinzel + Josefin Sans**,
`next/image`. Dev server:
`npm --prefix C:\Users\Tanne\MVP run dev -- -p 3210` (launch.json config `molokai-dev`).
`next.config.ts` has `images.qualities: [75, 100]` so `quality={100}` heroes aren't clamped.

## ⚠️ Deploy gotcha — push does NOT go live
The live site is deployed via the **Vercel CLI**, and this repo is **NOT connected to the Vercel
project** — so `git push` syncs GitHub but does **NOT** update the live page. Vercel CLI is not
installed here. To make pushes deploy: connect the repo to the Vercel project (one-time,
recommended) OR run `vercel --prod` from a machine that has the CLI.

## Photo grade
The warm "commissioned" look is the **`.graded`** CSS class in `app/globals.css`
(`saturate/contrast/brightness/sepia`), applied to most site photos. **Remove `.graded` from an
image to get true, un-muted color** (e.g. the /our-island collage hero).

## Contact form (Resend)
`app/api/contact/route.ts` → Resend; recipient = `CONTACT_TO_EMAIL || SITE.email`, and
`SITE.email` in `lib/site.ts` is already `dayna.harris@icloud.com` (code is correct). Delivery
needs a **verified Resend domain** — `realestateonmolokai.com` is registered (DNS pending). When
verified: set `CONTACT_FROM_EMAIL` to an address on it + `RESEND_API_KEY` in Vercel **Production**
+ redeploy. **Interim bridge:** set `CONTACT_TO_EMAIL=tannermosher2015@gmail.com` (the only
allowed recipient until the domain verifies) so the form stops erroring.
