# Regional franchise landing pages: recommended plan

Status: **plan only. No city or regional pages have been created.**
Source: the "LOCAL FRANCHISE KEYWORDS" and "FRANCHISE URL MAPPING" sheets of the keyword workbook (Keyword Stats 2026-11-23).

The national page is now the home page (`/`). The workbook assumed `/franchise/` plus `/franchise/<city>/`. Because the old Franchise page was merged into Home and `/preschool-franchise` redirects to `/`, regional pages should hang off a new, clean path that is not a copy of the home page.

## 1. Recommended URL structure

```
/                              National page: preschool franchise in India (exists)
/franchise-locations/          Hub: how territories work, regions overview, enquiry CTA
/franchise-locations/south-india/        Region hub (optional, later)
/franchise-locations/karnataka/          State hub: links to Bengaluru
/franchise-locations/tamil-nadu/         State hub: Chennai, Coimbatore
/franchise-locations/bengaluru/          City page (Phase 1)
/franchise-locations/hyderabad/          City page (Phase 1)
/franchise-locations/chennai/            City page (Phase 1)
/franchise-locations/delhi-ncr/          City page (Phase 1; covers Delhi, Noida, Gurugram)
```

Rules:
- Lowercase, hyphenated, no trailing parameters. City names in English, as people search them (Bengaluru and "Bangalore" are handled in copy and schema `alternateName`, not with two URLs).
- Noida, Gurugram and Faridabad are part of `delhi-ncr`, not separate pages (the workbook already maps "preschool franchise in noida" to the Delhi page).
- Low-volume cities (Pune, Mumbai, Ahmedabad, Kolkata, Jaipur, Lucknow and similar) go on **state or region hub pages** first. Promote a city to its own page only when it has genuinely distinct content and demonstrated demand.
- Keep the existing `/blog/...` articles as the informational layer. Regional pages are commercial pages and link to them, they do not repeat them.

## 2. Phasing and priority (search volume from the workbook)

| Phase | Page | Primary keyword (workbook volume) | Why |
|---|---|---|---|
| 0 | Hub `/franchise-locations/` | preschool franchise in india (500) | Entry point and internal-link parent |
| 1 | Bengaluru | preschool franchise in bangalore (500) | Home market; the parent preschool is here, so real local proof exists |
| 1 | Hyderabad | preschool franchise in hyderabad (500) | 500/mo, low competition |
| 1 | Chennai | preschool franchise in chennai (500) | 500/mo, low competition; links up to the Tamil Nadu hub |
| 1 | Delhi NCR | preschool franchise in delhi (500) | 500/mo, low competition |
| 2 | Tamil Nadu hub | preschool franchise in tamilnadu (50) | Covers Chennai and Coimbatore |
| 2 | Maharashtra hub | preschool franchise in maharashtra (50) | Covers Mumbai and Pune |
| 2 | Gujarat hub | preschool franchise in gujarat (50) | Covers Ahmedabad |
| 3 | Kolkata, Jaipur, Lucknow, Uttar Pradesh, Haryana and others | 50 each | Only when there is real content and a confirmed territory |

Do not build Phase 2 or 3 until Phase 1 pages have been live and measured for at least one quarter.

## 3. How to avoid duplicate and doorway content

A regional page is only worth publishing if more than the city name differs from the home page. Each page must contain **at least five** blocks that are specific to that location and that the business has verified:

1. **Territory status**, stated by the business: open, limited or not yet open for that city. Never imply availability the business has not confirmed.
2. **Local market facts** with a named, dated source (for example number of preschools or households in the area), or omit the block.
3. **Local premises guidance**: typical property types and rough rent or cost ranges for that city, supplied or approved by the business.
4. **Local regulatory notes** (registration and safety norms for that state), checked against the official source and dated.
5. **A real local proof point**: a partner or enquirer story used with permission, a visit or campus event in that city, or the Bengaluru parent preschool for the Bengaluru page. No invented testimonials.
6. **Local FAQ**: 3 to 5 questions people in that city actually ask, answered uniquely, not copied from the home page FAQ.

Pages that cannot meet this bar should not exist as separate URLs. Fold them into the hub instead.

Other safeguards:
- One primary keyword per page, mapped once. The home page keeps "preschool franchise" and "preschool franchise in India". City pages own only their city variants ("preschool franchise in hyderabad", "best preschool franchise in hyderabad" as a supporting phrase).
- Do not generate pages from a template with a city-name swap. Each page needs its own written copy.
- Canonical is self-referencing on every page. No cross-city canonicals.
- No hidden text, no city lists stuffed into footers, no near-identical meta descriptions.
- Competitor-brand keywords (Kidzee, FirstCry, Eurokids and so on) stay out of regional pages. They belong on a single comparison article, written only with verifiable facts.

## 4. Suggested page template (content, not copy)

1. H1 with the city keyword, for example "Preschool Franchise in Hyderabad".
2. Answer-first paragraph (40 to 60 words): what KinderBee offers there and what is confirmed.
3. Territory status block (business-confirmed).
4. Local market and premises guidance (sourced).
5. What the partner receives (short, links to the support section on the home page, no repeated long copy).
6. Models available there (new, rebrand, preschool plus daycare), only if confirmed for that city.
7. Local proof.
8. Local FAQ (visible, with FAQPage markup that matches).
9. Enquiry CTA (pop-up form and WhatsApp), pre-filled with the city.

Schema per page: `WebPage` plus `Service` (areaServed set to the city or state) plus `FAQPage` (visible FAQs only) plus `BreadcrumbList` (Home > Franchise locations > City).

## 5. Internal linking

- Home (`/`) India section: link each listed city or state to its page **once the page exists**. Until then they stay as plain text, as they are now.
- Hub links down to every live regional page. Every regional page links up to the hub and to the home page.
- Relevant blog posts (cost, how to start, zero royalty, preschool plus daycare) link to the matching regional page where the topic is local.
- Do not link parent-admission content into the franchise pages.

## 6. Information the business must provide before any page is built

- Which territories are open, limited or closed, and who confirms this.
- Verified city-level investment and premises ranges (the national figures of ₹15 to ₹30 Lakhs and 1,500 to 3,500 sq. ft. are still pending approval and must not be reused as city facts).
- The officially approved document checklist (also pending, see the home-page FAQ).
- Permission and details for any local partner story or testimonial.
- Verified official social profile URLs (for structured data).
- Whether regional pages should live under `/franchise-locations/` or another preferred path.

## 7. Measurement

Track per page: impressions and clicks for the primary keyword in Search Console, franchise enquiries by city field (the enquiry form already collects city), and enquiry-to-call conversion. Review after one quarter before adding further pages.
