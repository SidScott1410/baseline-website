# Baseline website

This repository contains the public, standalone deployment of Baseline's approved website. It includes the finished HTML, JavaScript, responsive images, fonts with their licenses, sharing image, browser icons, and Briefing Paper No.1, *Measuring the AI Economy* (19 pages). No private project history, drafts or credentials are included.

GitHub Pages publishes the root of `main`. `.nojekyll` keeps the site as plain static files; no dependency installation or backend is required. The temporary deployment origin is `https://sidscott1410.github.io/baseline-website/`. Local paths are relative so assets work there and at the eventual custom-domain root.

Inquiry and newsletter forms remain intentionally unavailable until real service endpoints are connected. Email fallbacks remain available.

## Custom-domain cutover

Once ready to point DNS to GitHub, set **Settings → Pages → Custom domain** to `www.baselineindex.org`, not `.com`. Update the existing GoDaddy `www` CNAME to `sidscott1410.github.io` (without a URL scheme, path or repository name). Replace the parked root `@` A record with four A records: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`. Preserve all email, verification, NS, SOA and `_domainconnect` records. GitHub supports the apex-to-www redirect when both DNS variants point correctly to Pages. Enable Enforce HTTPS once GitHub has issued the certificate.

When switching the custom domain, update the canonical URL, Open Graph/Twitter absolute image URLs, copyable briefing citation, robots sitemap URL, and sitemap entry from the temporary GitHub origin to `https://www.baselineindex.org`. Configure the custom domain before switching DNS to reduce domain-takeover risk. Do not keep conflicting parked or old-host website records.

Official setup guide: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
