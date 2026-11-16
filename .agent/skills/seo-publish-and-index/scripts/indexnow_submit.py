#!/usr/bin/env python3
"""
Automated SEO, GEO & IndexNow Verification and Submission Script
for Adrien Liss Photography (https://www.adrienlissphotography.com)
"""

import glob
import json
import os
import re
import sys
import urllib.parse
import urllib.request
import urllib.error
import xml.etree.ElementTree as ET
from datetime import datetime

HOST = "www.adrienlissphotography.com"
BASE_URL = f"https://{HOST}"
INDEXNOW_KEY = "7f4e9a2b8c1d6e3f5a0b9c8d7e6f1a2b"
KEY_LOCATION = f"{BASE_URL}/{INDEXNOW_KEY}.txt"
SITEMAP_PATH = "sitemap.xml"

def verify_site_integrity():
    print("=== 1. VERIFYING LOCAL SEO, SITEMAP & GEO FILES ===")
    required_files = [
        "robots.txt",
        "sitemap.xml",
        "llms.txt",
        "llms-full.txt",
        f"{INDEXNOW_KEY}.txt",
    ]
    for rf in required_files:
        if not os.path.isfile(rf):
            print(f"[ERROR] Missing required file: {rf}")
            sys.exit(1)
        print(f"  [OK] Found {rf}")

    # Parse sitemap.xml and extract all canonical URLs
    tree = ET.parse(SITEMAP_PATH)
    root = tree.getroot()
    ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    urls = [elem.text.strip() for elem in root.findall("sm:url/sm:loc", ns) if elem.text]
    print(f"  [OK] Parsed {len(urls)} canonical URLs from {SITEMAP_PATH}")

    # Audit HTML files for canonical tag, meta description, title, and JSON-LD
    html_files = sorted(f for f in glob.glob("*.html") if not f.startswith("google"))
    for hf in html_files:
        content = open(hf, encoding="utf-8").read()
        has_title = "<title>" in content
        has_desc = 'name="description"' in content
        has_canonical = 'rel="canonical"' in content
        has_jsonld = 'application/ld+json' in content
        if not all([has_title, has_desc, has_canonical, has_jsonld]):
            print(f"  [WARN] {hf} missing some SEO tags: title={has_title}, desc={has_desc}, canonical={has_canonical}, jsonld={has_jsonld}")
        else:
            print(f"  [OK] {hf}: Title, Meta Description, Canonical & Schema.org JSON-LD verified")

    return urls

def submit_indexnow(urls):
    print("\n=== 2. SUBMITTING URLS TO BING / CHATGPT SEARCH / INDEXNOW ===")
    payload = {
        "host": HOST,
        "key": INDEXNOW_KEY,
        "keyLocation": KEY_LOCATION,
        "urlList": urls,
    }
    data = json.dumps(payload).encode("utf-8")
    endpoints = [
        ("IndexNow Global API (Bing, Yandex, Seznam, Naver)", "https://api.indexnow.org/indexnow"),
        ("Microsoft Bing Direct IndexNow API", "https://www.bing.com/indexnow"),
    ]
    for name, endpoint in endpoints:
        req = urllib.request.Request(
            endpoint,
            data=data,
            headers={
                "Content-Type": "application/json; charset=utf-8",
                "User-Agent": "AdrienLissPhotography-SEOBot/1.0 (+https://www.adrienlissphotography.com)",
            },
            method="POST",
        )
        try:
            with urllib.request.urlopen(req, timeout=15) as resp:
                status = resp.getcode()
                print(f"  [SUCCESS] {name}: HTTP {status} ({len(urls)} URLs submitted!)")
        except urllib.error.HTTPError as e:
            print(f"  [HTTP {e.code}] {name}: {e.reason}")
            try:
                print("   ", e.read().decode("utf-8", errors="ignore")[:300])
            except Exception:
                pass
        except Exception as e:
            print(f"  [ERROR] {name}: {e}")

if __name__ == "__main__":
    urls = verify_site_integrity()
    if "--submit" in sys.argv:
        submit_indexnow(urls)
    else:
        print("\nRun with `--submit` to push URLs live to IndexNow / Bing API.")
