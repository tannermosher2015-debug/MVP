<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Real Estate on Molokai — project rules

Real estate website, live at https://www.realestateonmolokai.com.

## Stack
**Next.js 16.2.7** (App Router, Turbopack), `next/font` for **Cinzel + Josefin Sans**,
`next/image`. Repo root is `C:\dev\MVP`. Dev server:
`npm --prefix C:\dev\MVP run dev -- -p 3210` (launch.json config `molokai-dev`).
`next.config.ts` has `images.qualities: [75, 100]` so `quality={100}` heroes aren't clamped.

`node_modules` is not always present on a fresh clone, and `scripts/sync-listings.mjs` imports
`sharp`, so run `npm install` before any listings sync.

## A PUSH IS A PUBLISH
The repo IS connected to the Vercel project, so **`git push` to `main` deploys**: typically live
in 20 to 60 seconds, though the ~104MB photo repo occasionally jams a deploy for 7 to 15 minutes
(pushing one more commit nudges it clear). Verify locally before pushing, and verify the LIVE URL
by content afterwards, never by the push exiting 0.

(Corrected 2026-08-19. This section previously said push does NOT go live and that deploys ran
through the Vercel CLI. That has been false since the repo was connected on 2026-06-15, and it was
measured false again on 2026-08-19 by two pushes that both went live without any CLI step.)

## Photo grade
The warm "commissioned" look is the **`.graded`** CSS class in `app/globals.css`
(`saturate/contrast/brightness/sepia`), applied to most site photos. **Remove `.graded` from an
image to get true, un-muted color** (e.g. the /our-island collage hero).

## Contact form (Web3Forms)
Submissions go straight from the browser to **Web3Forms**, with no API route and no server key.
The access key sits in `components/Contact.tsx` and is public by design. `RentalInquiry.tsx` posts
to the same endpoint with the same key.

(Corrected 2026-08-19. This section previously described `app/api/contact/route.ts` posting to
Resend, with `RESEND_API_KEY` setup instructions. That route does not exist in the repo: checked
2026-08-19, `app/api/contact` is absent and `Contact.tsx` posts to `api.web3forms.com/submit`.)
