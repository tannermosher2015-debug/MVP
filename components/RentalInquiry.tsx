"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { SITE } from "@/lib/site";
import { RENTAL } from "@/lib/rental";

/**
 * Availability-inquiry form for the Kepuhi Beach Resort rental.
 *
 * Separate from <Contact /> because a stay inquiry needs dates and a guest
 * count, and Contact is a whole homepage section (SITE details + team + its
 * own `id="contact"`). Same Web3Forms endpoint and honeypot pattern.
 */

// Same public Web3Forms access key as components/Contact.tsx. Submissions are
// emailed to the address the key was created with (dayna.harris@icloud.com).
// Public by design, not a secret. If rental inquiries should land in a
// different inbox, create a second key and swap it here.
const WEB3FORMS_ACCESS_KEY = "e9374d97-a1fd-441f-b47c-19afbf54ef89";

type Field = "name" | "email" | "phone" | "arrive" | "depart" | "guests" | "message";
type Values = Record<Field, string>;
type Errors = Partial<Record<Field, string>>;

const initial: Values = {
  name: "",
  email: "",
  phone: "",
  arrive: "",
  depart: "",
  guests: "2",
  message: "",
};

export default function RentalInquiry() {
  const [values, setValues] = useState<Values>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  // Honeypot: hidden from real users; bots fill it and get silently dropped.
  const [company, setCompany] = useState("");

  const set = (field: Field, value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const validate = (): Errors => {
    const e: Errors = {};
    if (!values.name.trim()) e.name = "Please enter your name.";
    if (!values.email.trim()) e.email = "Please enter your email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
      e.email = "Please enter a valid email address.";
    // ponytail: <input type="date"> always yields ISO "YYYY-MM-DD", which sorts
    // lexicographically, so a plain string compare is a correct date compare
    // here. No parsing, no date library.
    if (values.arrive && values.depart && values.depart <= values.arrive)
      e.depart = "Check-out needs to be after check-in.";
    if (!values.message.trim()) e.message = "Tell us a little about your trip.";
    return e;
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    const firstError = (Object.keys(e) as Field[])[0];
    if (firstError) {
      document.getElementById(`rental-${firstError}`)?.focus();
      return;
    }
    if (company.trim()) {
      setStatus("success");
      return;
    }
    setStatus("submitting");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `Vacation rental inquiry: ${values.name} (${RENTAL.complex})`,
          from_name: "Real Estate on Molokaʻi website",
          property: `${RENTAL.complex}, ${RENTAL.address}`,
          name: values.name,
          email: values.email,
          replyto: values.email,
          phone: values.phone || "Not provided",
          check_in: values.arrive || "Not specified",
          check_out: values.depart || "Not specified",
          guests: values.guests,
          message: values.message,
        }),
      });
      const data = (await res.json().catch(() => ({ success: false }))) as { success?: boolean };
      if (!data.success) throw new Error("Submission failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const inputBase =
    "w-full rounded-xl border bg-ivory px-4 py-3 text-base text-ink placeholder:text-taupe/60 transition-colors focus:outline-none focus-visible:border-bronze";
  const labelBase = "mb-1.5 block text-xs tracking-wide-2 uppercase text-taupe";
  const today = new Date().toISOString().slice(0, 10);

  if (status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex min-h-[24rem] flex-col items-center justify-center rounded-3xl bg-ivory p-10 text-center shadow-2xl"
      >
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-ocean text-ivory">
          <Check className="h-8 w-8" aria-hidden />
        </span>
        <h3 className="mt-6 font-display text-3xl text-ink">Mahalo!</h3>
        <p className="measure mt-3 text-cocoa">
          Your inquiry is on its way. We&apos;ll come back to you on availability for
          those dates, or call{" "}
          <a href={SITE.phoneHref} className="nums text-bronze-deep underline">
            {SITE.phone}
          </a>{" "}
          anytime.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-ivory p-7 text-ink shadow-2xl sm:p-10">
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        {/* Honeypot: visually hidden; real users never fill it. */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            width: 1,
            height: 1,
            padding: 0,
            margin: -1,
            overflow: "hidden",
            clip: "rect(0,0,0,0)",
            border: 0,
          }}
        >
          <label htmlFor="rental-company">Company</label>
          <input
            id="rental-company"
            name="company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="rental-name" className={labelBase}>
              Name <span className="text-bronze">*</span>
            </label>
            <input
              id="rental-name"
              name="name"
              type="text"
              autoComplete="name"
              value={values.name}
              onChange={(e) => set("name", e.target.value)}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "rental-err-name" : undefined}
              className={`${inputBase} ${errors.name ? "border-red-500" : "border-ink/15"}`}
            />
            {errors.name && (
              <p id="rental-err-name" role="alert" className="mt-1.5 text-sm text-red-600">
                {errors.name}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="rental-phone" className={labelBase}>
              Phone
            </label>
            <input
              id="rental-phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={values.phone}
              onChange={(e) => set("phone", e.target.value)}
              className={`${inputBase} border-ink/15`}
            />
          </div>
        </div>

        <div>
          <label htmlFor="rental-email" className={labelBase}>
            Email <span className="text-bronze">*</span>
          </label>
          <input
            id="rental-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "rental-err-email" : undefined}
            className={`${inputBase} ${errors.email ? "border-red-500" : "border-ink/15"}`}
          />
          {errors.email && (
            <p id="rental-err-email" role="alert" className="mt-1.5 text-sm text-red-600">
              {errors.email}
            </p>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <label htmlFor="rental-arrive" className={labelBase}>
              Check-in
            </label>
            <input
              id="rental-arrive"
              name="arrive"
              type="date"
              min={today}
              value={values.arrive}
              onChange={(e) => set("arrive", e.target.value)}
              className={`${inputBase} border-ink/15`}
            />
          </div>
          <div>
            <label htmlFor="rental-depart" className={labelBase}>
              Check-out
            </label>
            <input
              id="rental-depart"
              name="depart"
              type="date"
              min={values.arrive || today}
              value={values.depart}
              onChange={(e) => set("depart", e.target.value)}
              aria-invalid={!!errors.depart}
              aria-describedby={errors.depart ? "rental-err-depart" : undefined}
              className={`${inputBase} ${errors.depart ? "border-red-500" : "border-ink/15"}`}
            />
          </div>
          <div>
            <label htmlFor="rental-guests" className={labelBase}>
              Guests
            </label>
            {/* Capped at the unit's real capacity rather than an arbitrary 12.
                The form is noValidate, so this bounds the stepper and signals
                the limit without hard-blocking a larger party from asking. */}
            <input
              id="rental-guests"
              name="guests"
              type="number"
              inputMode="numeric"
              min={1}
              max={RENTAL.maxGuests}
              value={values.guests}
              onChange={(e) => set("guests", e.target.value)}
              className={`${inputBase} border-ink/15`}
            />
          </div>
        </div>
        {errors.depart && (
          <p id="rental-err-depart" role="alert" className="-mt-2 text-sm text-red-600">
            {errors.depart}
          </p>
        )}

        <div>
          <label htmlFor="rental-message" className={labelBase}>
            About your trip <span className="text-bronze">*</span>
          </label>
          <textarea
            id="rental-message"
            name="message"
            rows={4}
            placeholder="Who's travelling, what you're hoping to do on Molokaʻi, anything you need from the place."
            value={values.message}
            onChange={(e) => set("message", e.target.value)}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "rental-err-message" : undefined}
            className={`${inputBase} resize-none ${errors.message ? "border-red-500" : "border-ink/15"}`}
          />
          {errors.message && (
            <p id="rental-err-message" role="alert" className="mt-1.5 text-sm text-red-600">
              {errors.message}
            </p>
          )}
        </div>

        {status === "error" && (
          <div role="alert" className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
            Something went wrong sending your inquiry. Please try again, or call{" "}
            <a href={SITE.phoneHref} className="nums font-medium underline">
              {SITE.phone}
            </a>{" "}
            or email{" "}
            <a href={SITE.emailHref} className="font-medium underline">
              {SITE.email}
            </a>
            .
          </div>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="group flex w-full items-center justify-center gap-3 rounded-full bg-ink px-8 py-4 text-xs tracking-luxe uppercase text-ivory transition-colors duration-300 hover:bg-bronze disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === "submitting" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Sending…
            </>
          ) : (
            "Check availability"
          )}
        </button>
        <p className="text-center text-xs text-taupe">
          Or call {SITE.broker.name.split(" ")[0]} directly at{" "}
          <a href={SITE.phoneHref} className="nums text-bronze-deep underline">
            {SITE.phone}
          </a>
        </p>
      </form>
    </div>
  );
}
