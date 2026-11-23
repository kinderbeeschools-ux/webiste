# KinderBee final SEO production audit (home page `/`)

Tested on 23 Nov 2026 against the live site, https://www.kinderbeeschools.com/. Every result below was produced by an actual test. Anything not testable is marked **not tested**.

## 1. Results at a glance

| Area | Result |
|---|---|
| Google Rich Results Test | 1 valid item (Organization). After a fix made during this audit, **0 issues**. Re-tested live. |
| Schema Markup Validator (validator.schema.org) | 4 items (EducationalOrganization, WebSite, Service, FAQPage), **0 errors, 0 warnings** |
| PageSpeed mobile | **Performance 47 and 67** (two runs), Accessibility 95, Best Practices 100, SEO 100 |
| PageSpeed desktop | **Performance 90**, Accessibility 95, Best Practices 100, SEO 100 |
| Core Web Vitals field data (real users) | **No data** for this URL in PageSpeed Insights, so real-user LCP, INP and CLS are **not measured** |
| Canonical / indexability | Home canonical is `https://www.kinderbeeschools.com/`, robots `index, follow` |
| Sitemap / robots.txt | Sitemap reachable (HTTP 200, 39 URLs). robots.txt reachable and references it |
| Unsupported financial claims | None remain on public pages. See section 5 for what was found and fixed |

## 2. Critical issues (ranked)

1. **Mobile LCP is poor: 9.3 s and 7.8 s** (good is 2.5 s or less). Mobile scores 47 and 67.
   - The LCP element is the hero image. Its network load takes about 290 ms, but it is hidden by the site-wide scroll-reveal script (`useAutoReveal`, class `kb-r`, opacity 0) until JavaScript downloads and runs, then fades in over about 1.1 s. PageSpeed reports about 2.3 s of render delay on the image.
   - The dependency chain also waits on a 358 KiB JavaScript bundle and three API calls. `/api/blogs` (53 KiB) finishes at about 3.9 s in the lab, and the Home page no longer shows any blog posts.
   - Total blocking time is 340 to 540 ms on mobile. First Contentful Paint is 1.7 to 4.5 s.
2. **Static files are not cached.** PageSpeed estimates 423 KiB of savings. The hero image is served with `Cache-Control: max-age=0, must-revalidate`.
3. **Image delivery:** estimated savings of 290 KiB (mobile) and 267 KiB (desktop). The images lack explicit width and height attributes. I did not identify which files; run the PageSpeed "Improve image delivery" insight for the list.
4. **`/joint-ventures` is `noindex` but listed in the sitemap.** A sitemap should list only indexable URLs.
5. **Duplicate meta description** on `/cbse-school-setup` and `/degree-college-setup`.
6. **Titles and descriptions out of range on other pages:** 10 or more non-blog pages have titles over 60 characters (for example `/investors` is 75), and blog titles run from 85 to 139 characters. Eight pages have descriptions over 160 characters. The home page is within range (title 55, description 155).
7. **Accessibility 95 (both devices):** insufficient colour contrast in places, and heading levels that are not strictly sequential. Elements were not identified in detail.
8. **Social profile URLs are unverified** (section 4).
9. **WhatsApp and phone clicks are not tracked** (section 6).
10. **Google Search Console verification could not be confirmed.** There is no `google-site-verification` tag in the home page HTML. The only verification-style file in `/public` is an IndexNow key. The property may be verified another way (DNS or Analytics); I could not check.

Informational: Google no longer shows FAQ rich results for most sites, so the Rich Results Test does not list FAQPage. The markup is valid (Schema Markup Validator) and matches the visible FAQs. It is kept for AI and answer-engine readability, not for a search-result feature.

## 3. Fixed during this audit

| Problem | Fix | Verified live |
|---|---|---|
| My earlier change made `Organization.logo` the hero photo | Logo now uses the real logo | Yes (HTML) |
| Address missing `addressLocality` and `postalCode` (2 non-critical Google notices) | Added Bengaluru and 560016, taken from the existing published address | Yes. Rich Results Test now shows no issues |
| CMS page records still had "high-profit Preschool Franchises", "Capital Appreciation & Enterprise Growth", "Robust Multi-Year Fiscal Security" | Replaced with neutral wording in the code defaults and the seed data | Yes (`/api/pages`) |

## 4. Social links (not assumed official)

Every location where a Facebook, Instagram or LinkedIn URL appears:

| Location | Facebook | Instagram | LinkedIn |
|---|---|---|---|
| Live website settings (`/api/settings`, editable in Admin, Social links) | `facebook.com/kinderbee` | `instagram.com/kinderbee` | `linkedin.com/company/kinderbee-education` |
| Footer (`src/components/Footer.tsx`), shown on every public page | same, from settings; same hard-coded fallbacks | same | same |
| Default settings in code (`server.ts`) | same | same | same |
| Organization schema | **removed**, no `sameAs` | | |
| Other public pages, `llms.txt`, `index.html` | none found | | |

All three URLs return HTTP 200, but that proves nothing, because these sites return 200 for almost any path. They look like guessed handles. **Please confirm or replace them** in Admin, Social links. After you confirm, I can add them back to the schema as `sameAs`.

## 5. Claims scan (public pages, live CMS, API content, static files)

Scanned: all 39 sitemap pages, `/api/settings`, `/api/pages`, `/api/blogs`, `/api/faqs`, `/api/opportunities`, `/api/gallery`, `llms.txt`, `robots.txt`, plus the source code.

**Removed or neutralised (earlier this session and now):**
- "18-month payback guidance" (blog sidebar banner on every post)
- "projected 18-month ROI model" (blog page sidebar)
- "18-month payback" (site-wide default meta description)
- "fast ROI within 18-24 months", "rapid capital recovery", "highly resilient cash flows", "High ROI" (Investors page record in the CMS data and code defaults)
- "high-profit Preschool Franchises" (Partnerships page record)
- "Capital Appreciation & Enterprise Growth" and "Robust Multi-Year Fiscal Security" (Investors page record)
- "Prestige & ROI" (Investors page heading, now "Prestige & Impact")

**Remaining occurrences, reviewed:**

| Where | Text | Assessment |
|---|---|---|
| `/blog/blog-1794943501768`, `/blog/blog-1794941304782` (and `/api/blogs`) | "does not guarantee … investment payback", "Keep investment payback separate from operating break even" | Disclaimers, not claims |
| `/blog/journal-zero-royalty-preschool-franchise-india` | "not as guaranteed profit", "Does a zero-royalty model guarantee higher profit? No." | Disclaimers |
| `/blog/journal-preschool-daycare-combo-business-model-india` | "Is daycare automatically more profitable than preschool? No." | Disclaimer |
| `/joint-ventures`, `/api/opportunities` | "developer-funded development with an agreed capital recovery"; "No assured return" | A deal-structure term plus a disclaimer. Review the wording with your legal adviser |
| `/programs` | "6 to 18 Months Turnkey Project" | A project duration, not a returns claim |
| `/blog` | Tag "Preschool ROI" | A category label. Not a claim, but you may rename it |

**Not changed and not sourced:** the ₹15 to ₹30 Lakhs and 1,500 to 3,500 sq. ft. figures remain pending your verification, and the home page now words them as indicative.

## 6. SEO monitoring and tracking plan

### What is already installed (found in the site code)
- **Google Analytics 4**, Measurement ID `G-73P8YFW61Z`, in `index.html`. Page changes are recorded by enhanced measurement.
- **`generate_lead` event** sent on form and lead actions with `lead_type`, `form_name` and `program`. This covers the enquiry pop-up, brochure download, consultation booking, contact page, joint-venture forms, course payment and newsletter. The code comment says to mark it as a Key event in GA4. **I could not check that in GA4; please confirm.**
- **Meta Pixel** `1403253398552035` (PageView), with a server-side Lead event that stays inactive until a token is configured.
- **Not tracked:** WhatsApp clicks (floating button, sticky widget, closing call to action), phone-call clicks, and the franchise PDF button as its own CTA (brochure form fills are tracked as a lead).

### Google Search Console
1. Confirm a **Domain property** for `kinderbeeschools.com` (DNS verification covers www and non-www). Submit `https://www.kinderbeeschools.com/sitemap.xml`.
2. Link Search Console to GA4.
3. Watch the Pages report for "Indexed", "Crawled, not indexed" and "Duplicate, Google chose a different canonical".
4. Request indexing for `/` after each significant change.
5. Performance report, filtered to Page = `https://www.kinderbeeschools.com/`, with a saved query filter for: "preschool franchise", "preschool franchise in india", "preschool franchise opportunities", "nursery franchise", "kindergarten franchise", "playgroup franchise", "zero royalty preschool franchise".
6. Export weekly: **Clicks, Impressions, CTR, Average position** by query and by page. Record week 1 as the baseline. I have set no targets, since none are supportable without a baseline.

### GA4 conversions and events
| Measure | Event / report | Status |
|---|---|---|
| Franchise enquiry (form) | `generate_lead` with `lead_type = franchise` | Fires today. Confirm the Key event flag |
| Any form submission | `generate_lead` by `form_name` | Fires today |
| Franchise PDF download | `generate_lead` with `lead_type = brochure` | Fires today |
| WhatsApp click | new `whatsapp_click` event (place: hero, closing CTA, floating button) | **Not implemented; needs a small code change** |
| Phone click | new `phone_click` event | **Not implemented** |
| CTA clicks | new `cta_click` with `cta_name` (hero, KIPS, closing) | **Not implemented** |
| Organic only | Explorer report, Session default channel group = Organic Search, landing page `/` | Report setup only |
- Register `lead_type`, `form_name` and `program` as GA4 custom dimensions so they appear in reports.
- Build one Looker Studio dashboard joining Search Console (clicks, impressions, CTR, position) with GA4 (organic sessions, `generate_lead`, WhatsApp clicks).

### Review cadence
Weekly: queries, indexing, enquiries. Monthly: compare against the week-1 baseline. After 8 to 12 weeks, judge ranking changes.

## 7. Remaining CMS and content updates (needs you)
1. Verified Facebook, Instagram and LinkedIn URLs (Admin, Social links).
2. Official documents checklist (home FAQ 1 stays generic until then).
3. Approval of the ₹15 to ₹30 Lakhs and 1,500 to 3,500 sq. ft. figures.
4. Review the Joint Ventures wording ("agreed capital recovery").
5. Decide whether to rename the "Preschool ROI" blog tag.
6. Shorten titles and descriptions on pages listed in section 2, item 6, and make the CBSE and Degree descriptions unique. This is CMS or code content on those pages.
7. Decide whether `/joint-ventures` should be indexed. If yes, remove noindex. If no, remove it from the sitemap.

## 8. Recommended 30-day action plan

**Week 1: speed and indexing**
- Stop the hero image being hidden by the scroll-reveal script (exclude above-the-fold images), and add a preload hint for it. This targets the 7.8 to 9.3 s mobile LCP.
- Load blog data only on pages that show blogs, not on every page.
- Add long cache headers for images and fonts.
- Set explicit width and height on images, and serve smaller mobile image sizes.
- In Search Console: confirm the property, submit the sitemap, request indexing for `/`, and record baselines.
- Re-run PageSpeed on mobile three times and compare.

**Week 2: tracking and technical clean-up**
- Add `whatsapp_click`, `phone_click` and `cta_click` events. Confirm `generate_lead` is a GA4 Key event.
- Fix the sitemap and noindex conflict, the duplicate descriptions and the over-length titles.
- Fix the accessibility contrast and heading-order findings.

**Week 3: content (after your approvals)**
- Publish the confirmed documents checklist and figures.
- Write the missing supporting articles from the workbook (best preschool franchise, low-cost no-royalty franchise, franchise vs independent preschool, preschool plus daycare, best cities). Link each one back to `/`.
- Add confirmed social profiles to the schema.

**Week 4: measure and decide**
- Compare Search Console against the week-1 baseline (impressions, clicks, CTR, position) and GA4 enquiries.
- Decide whether to start the regional pages from `docs/regional-franchise-landing-page-plan.md`, starting with the hub, and only for territories you confirm.

## 9. What was not tested
- Real-user Core Web Vitals and INP (no field data exists for the URL yet; lab INP is not reported).
- Rankings and search positions.
- Search Console and GA4 account settings (no access from here).
- Pages other than the home page for PageSpeed and schema.
