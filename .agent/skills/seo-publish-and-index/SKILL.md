---
name: seo-publish-and-index
description: Automated SEO & AI Search (GEO) audit, GitHub/Vercel deployment, and instant IndexNow submission to Bing, ChatGPT Search, Microsoft Copilot, Yandex, and Seznam for Adrien Liss Photography (www.adrienlissphotography.com). Use whenever pages, articles, or SEO metadata are updated and need to be published and indexed automatically at zero cost.
---

# SEO Publish & Instant IndexNow Skill (`seo-publish-and-index`)

This workspace skill automates **100% free** technical SEO verification, deployment to Vercel via GitHub, and instant URL indexing across **Microsoft Bing, ChatGPT Search (OpenAI), Microsoft Copilot, DuckDuckGo, Yahoo, Yandex, and Seznam** via the open **IndexNow** protocol.

## Key Configuration
- **Canonical Host**: `www.adrienlissphotography.com`
- **IndexNow Verification Key**: `7f4e9a2b8c1d6e3f5a0b9c8d7e6f1a2b`
- **Key File on Root**: `/7f4e9a2b8c1d6e3f5a0b9c8d7e6f1a2b.txt`
- **Sitemap**: `https://www.adrienlissphotography.com/sitemap.xml`
- **AI Discovery Files**: `https://www.adrienlissphotography.com/llms.txt` and `https://www.adrienlissphotography.com/llms-full.txt`

## Workflow Steps

### Step 1: Regenerate Full Image SEO Sitemap & Run Local Audit
First, regenerate `sitemap.xml` (so all 360+ portfolio photographs are indexed with SEO titles) and run the verification script:
```bash
python3 .agent/skills/seo-publish-and-index/scripts/generate_image_sitemap.py
python3 .agent/skills/seo-publish-and-index/scripts/indexnow_submit.py
```

### Step 2: Commit & Push to GitHub (Triggers Vercel Production Deploy)
Commit any modified files and push to `origin/main` (run with `BypassSandbox: true` because `.git` lock creation and network push require unsandboxed access):
```bash
git add -A && git commit -m "Update site content and SEO metadata" && git push origin main
```

### Step 3: Instant IndexNow Ping to Bing & ChatGPT Search
Once Vercel finishes deploying (typically ~15–20 seconds after push), run the IndexNow submission script with `--submit` (using `BypassSandbox: true` for network access) to notify Bing and IndexNow search engines immediately:
```bash
python3 .agent/skills/seo-publish-and-index/scripts/indexnow_submit.py --submit
```
- **HTTP 200 / HTTP 202** confirms that Bing & IndexNow have accepted all 11 URLs and queued them for immediate crawling at zero cost.
