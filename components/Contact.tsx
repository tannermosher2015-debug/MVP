"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Check, Loader2 } from "lucide-react";
import { Reveal } from "@/components/motion";
import Eyebrow from "@/components/Eyebrow";
import { SITE } from "@/lib/site";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.78-3.91 1.1 0 2.24.2 2.24.2v2.48h-1.26c-1.24 0-1.63.78-1.63 1.57v1.87h2.78l-.44 2.91h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94Z" />
    </svg>
  );
}

type Field = "name" | "email" | "phone" | "interest" | "message";
type Values = Record<Field, string>;
type Errors = Partial<Record<Field, string>>;

const INTERESTS = [
  "Buying a property",
  "Selling a property",
  "Long-term management",
  "Vacation rental management",
  "General inquiry",
];

const initial: Values = {
  name: "",
  email: "",
  phone: "",
  interest: INTERESTS[0],
  message: "",
};

// Web3Forms public access key (safe to expose in client code). Submissions are
// emailed to the address this key was created with. Created via web3forms.com.
const WEB3FORMS_ACCESS_KEY = "7ee2a4e1-7262-4e59-8b14-63de80268b8e";

export default function Contact() {
  const [values, setValues] = useState<Values>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  // Honeypot — hidden from real users; bots fill it and get silently dropped.
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
    if (!values.message.trim()) e.message = "Tell us a little about what you're looking for.";
    return e;
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    const firstError = (Object.keys(e) as Field[])[0];
    if (firstError) {
      document.getElementById(`field-${firstError}`)?.focus();
      return;
    }
    // Honeypot: bots fill the hidden field — silently drop them.
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
          subject: `New website inquiry — ${values.name} (${values.interest})`,
          from_name: "Real Estate on Molokaʻi website",
          name: values.name,
          email: values.email,
          replyto: values.email,
          phone: values.phone || "—",
          interest: values.interest,
          message: values.message,
        }),
      });
      const data = (await res.json().catch(() => ({ success: false }))) as {
        success?: boolean;
      };
      if (!data.success) throw new Error("Submission failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const inputBase =
    "w-full rounded-xl border bg-ivory px-4 py-3 text-base text-ink placeholder:text-taupe/60 transition-colors focus:outline-none focus-visible:border-bronze";

  return (
    <section
      id="contact"
      className="scroll-mt-24 bg-espresso py-24 text-ivory sm:py-32"
    >
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-16">
        {/* Left — details */}
        <Reveal className="lg:col-span-5">
          <Eyebrow index="07" tone="light">Get in touch</Eyebrow>
          <h2 className="mt-4 text-display-sm font-display text-ivory">
            Let&apos;s find your
            <br />
            place on Molokaʻi
          </h2>
          <p className="measure mt-6 text-lg text-ivory/70">
            Tell us what you&apos;re dreaming of — a beach cottage, an oceanfront
            estate, or a worry-free island investment. Dayna will be in touch
            personally.
          </p>

          <ul className="mt-10 space-y-5">
            <li>
              <a href={SITE.phoneHref} className="group flex items-center gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/30 text-gold transition-colors group-hover:bg-gold group-hover:text-espresso">
                  <Phone className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                </span>
                <span className="nums text-lg tracking-wide-2 text-ivory">
                  {SITE.phone}
                </span>
              </a>
            </li>
            <li>
              <a href={SITE.emailHref} className="group flex items-center gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/30 text-gold transition-colors group-hover:bg-gold group-hover:text-espresso">
                  <Mail className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                </span>
                <span className="text-lg text-ivory">{SITE.email}</span>
              </a>
            </li>
            <li className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/30 text-gold">
                <MapPin className="h-5 w-5" strokeWidth={1.5} aria-hidden />
              </span>
              <span className="text-lg leading-snug text-ivory/85">
                <span className="block font-display text-ivory">{SITE.legalName}</span>
                <span className="mb-2 block text-xs tracking-wide-2 uppercase text-gold/80">
                  Office Lic. {SITE.license}
                </span>
                {SITE.address.line1}
                <br />
                {SITE.address.city}, {SITE.address.region} {SITE.address.postal}
                <span className="mt-1 block text-sm text-ivory/50">
                  {SITE.address.landmark}
                </span>
              </span>
            </li>
            <li>
              <a
                href={SITE.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/30 text-gold transition-colors group-hover:bg-gold group-hover:text-espresso">
                  <FacebookIcon className="h-5 w-5" />
                </span>
                <span className="text-lg text-ivory/85">Joys of Island Life</span>
              </a>
            </li>
          </ul>

          {/* Team */}
          <div className="mt-10 border-t border-ivory/10 pt-8">
            <p className="text-xs tracking-luxe uppercase text-gold">Our team</p>
            <ul className="mt-4 space-y-3">
              {SITE.team.map((m) => (
                <li key={m.name} className="flex items-baseline justify-between gap-4">
                  <span>
                    <span className="text-ivory">{m.name}</span>
                    <span className="ml-2 text-sm text-ivory/55">{m.role}</span>
                  </span>
                  <a
                    href={m.phoneHref}
                    className="nums shrink-0 text-sm tracking-wide-2 text-ivory/70 transition-colors hover:text-gold"
                  >
                    {m.phone}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* Right — form */}
        <Reveal className="lg:col-span-7" delay={0.1}>
          <div className="rounded-3xl bg-ivory p-7 text-ink shadow-2xl sm:p-10">
            {status === "success" ? (
              <div
                role="status"
                aria-live="polite"
                className="flex min-h-[24rem] flex-col items-center justify-center text-center"
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-ocean text-ivory">
                  <Check className="h-8 w-8" aria-hidden />
                </span>
                <h3 className="mt-6 font-display text-3xl text-ink">Mahalo!</h3>
                <p className="measure mt-3 text-cocoa">
                  Your message is on its way. Dayna will reach out shortly — or
                  call{" "}
                  <a href={SITE.phoneHref} className="nums text-bronze-deep underline">
                    {SITE.phone}
                  </a>{" "}
                  anytime.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="space-y-5">
                {/* Honeypot — visually hidden; real users never fill it. */}
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
                  <label htmlFor="field-company">Company</label>
                  <input
                    id="field-company"
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
                    <label
                      htmlFor="field-name"
                      className="mb-1.5 block text-xs tracking-wide-2 uppercase text-taupe"
                    >
                      Name <span className="text-bronze">*</span>
                    </label>
                    <input
                      id="field-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      value={values.name}
                      onChange={(e) => set("name", e.target.value)}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "err-name" : undefined}
                      className={`${inputBase} ${errors.name ? "border-red-500" : "border-ink/15"}`}
                    />
                    {errors.name && (
                      <p id="err-name" role="alert" className="mt-1.5 text-sm text-red-600">
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="field-phone"
                      className="mb-1.5 block text-xs tracking-wide-2 uppercase text-taupe"
                    >
                      Phone
                    </label>
                    <input
                      id="field-phone"
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
                  <label
                    htmlFor="field-email"
                    className="mb-1.5 block text-xs tracking-wide-2 uppercase text-taupe"
                  >
                    Email <span className="text-bronze">*</span>
                  </label>
                  <input
                    id="field-email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={values.email}
                    onChange={(e) => set("email", e.target.value)}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "err-email" : undefined}
                    className={`${inputBase} ${errors.email ? "border-red-500" : "border-ink/15"}`}
                  />
                  {errors.email && (
                    <p id="err-email" role="alert" className="mt-1.5 text-sm text-red-600">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="field-interest"
                    className="mb-1.5 block text-xs tracking-wide-2 uppercase text-taupe"
                  >
                    I&apos;m interested in
                  </label>
                  <select
                    id="field-interest"
                    name="interest"
                    value={values.interest}
                    onChange={(e) => set("interest", e.target.value)}
                    className={`${inputBase} border-ink/15`}
                  >
                    {INTERESTS.map((i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="field-message"
                    className="mb-1.5 block text-xs tracking-wide-2 uppercase text-taupe"
                  >
                    Message <span className="text-bronze">*</span>
                  </label>
                  <textarea
                    id="field-message"
                    name="message"
                    rows={4}
                    value={values.message}
                    onChange={(e) => set("message", e.target.value)}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? "err-message" : undefined}
                    className={`${inputBase} resize-none ${errors.message ? "border-red-500" : "border-ink/15"}`}
                  />
                  {errors.message && (
                    <p id="err-message" role="alert" className="mt-1.5 text-sm text-red-600">
                      {errors.message}
                    </p>
                  )}
                </div>

                {status === "error" && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700"
                  >
                    Something went wrong sending your message. Please try again — or
                    call{" "}
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
                    "Send message"
                  )}
                </button>
                <p className="text-center text-xs text-taupe">
                  Or call {SITE.broker.name.split(" ")[0]} directly at{" "}
                  <a href={SITE.phoneHref} className="nums text-bronze-deep underline">
                    {SITE.phone}
                  </a>
                </p>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
