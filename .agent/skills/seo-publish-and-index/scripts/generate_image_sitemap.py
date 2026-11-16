#!/usr/bin/env python3
"""
Generates the complete Google & Bing Image SEO Sitemap (sitemap.xml)
including all 11 canonical pages and all 320+ portfolio photographs with SEO titles.
"""

import json
import re
import urllib.parse
import xml.sax.saxutils as sax
from datetime import datetime

BASE = "https://www.adrienlissphotography.com"
TODAY = datetime.now().strftime("%Y-%m-%d")

def to_full_url(rel_path):
    p = rel_path[2:] if rel_path.startswith("./") else rel_path
    parts = [urllib.parse.quote(urllib.parse.unquote(seg), safe=":(),-_.") for seg in p.split("/")]
    return f"{BASE}/" + "/".join(parts)

def main():
    c = open("assets_list.js", encoding="utf-8").read()
    m = re.search(r"const ASSETS_LIST\s*=\s*(\{.*\});", c, re.S)
    assets = json.loads(m.group(1))

    pages = [
        {
            "loc": f"{BASE}/",
            "priority": "1.0",
            "changefreq": "weekly",
            "images": [
                (to_full_url("./:assets:hero:/Portrait.jpg"), "Adrien Liss Photography London — Fine Art Portraits & Spotlight Headshots"),
                (to_full_url("./:assets:hero:/Real Estate.jpg"), "Prime London Real Estate & Architectural Photography — Adrien Liss"),
                (to_full_url("./:assets:hero:/Wedding.jpg"), "Luxury Editorial Wedding Photography London — Adrien Liss"),
                (to_full_url("./:assets:portraits:/Headshots:Portrait/AL_03818.jpg"), "Spotlight Actor Headshot Portrait London — Adrien Liss"),
                (to_full_url("./:assets:fashion/Fashion/_MG_7706.jpeg"), "High Fashion & Couture Editorial Campaign — Adrien Liss"),
                (to_full_url("./:assets:real-estate:/Real Estate/_DSC3500-HDR-2-Edit.jpg"), "Chelsea & Kensington Luxury Residence Dusk Photography — Adrien Liss"),
                (to_full_url("./:assets:weddings-events:/Weddings/_R0B6445.jpg"), "Fine Art Monochrome Wedding Photography London — Adrien Liss"),
                (to_full_url("./:assets:portraits:/Headshots:Portrait/Corporate/_DSC2833.jpg"), "Executive Leadership Corporate Portrait London — Adrien Liss"),
                (to_full_url("./:assets:real-estate:/Real Estate/_DSC4785-HDR.jpg"), "Bespoke Marble Kitchen Interior Design Photography London — Adrien Liss"),
                (to_full_url("./assets/about-me/adrien-liss-portrait.jpg"), "Adrien Liss — Photographer, Actor & Creative Director in London"),
            ] + [
                (to_full_url(p), f"Family & Lifestyle Fine Art Portrait London #{i+1} — Adrien Liss Photography")
                for i, p in enumerate(assets.get("family", []))
            ],
        },
        {
            "loc": f"{BASE}/headshots.html",
            "priority": "0.9",
            "changefreq": "weekly",
            "images": [
                (to_full_url("./:assets:portraits:/Headshots:Portrait/AL_03818.jpg"), "Actors Headshots London — Spotlight & Theatrical Casting Portraits by Adrien Liss"),
                (to_full_url("./:assets:portraits:/Headshots:Portrait/Corporate/AL_08740.jpeg"), "Corporate & Executive Headshots London — Adrien Liss Photography"),
            ],
        },
        {
            "loc": f"{BASE}/actors-headshots-london.html",
            "priority": "0.95",
            "changefreq": "weekly",
            "images": [
                (to_full_url(p), f"Actors Headshots London — Spotlight Casting & Drama Portrait #{i+1} by Adrien Liss")
                for i, p in enumerate(assets.get("actors", []))
            ],
        },
        {
            "loc": f"{BASE}/corporate-headshots.html",
            "priority": "0.95",
            "changefreq": "weekly",
            "images": [
                (to_full_url(p), f"Corporate & Executive Headshot London (City, Mayfair & Canary Wharf) #{i+1} — Adrien Liss")
                for i, p in enumerate(assets.get("corporate", []))
            ],
        },
        {
            "loc": f"{BASE}/fashion.html",
            "priority": "0.9",
            "changefreq": "weekly",
            "images": [
                (to_full_url(p), f"London Fashion Editorial & Signed Agency Model Portfolio Look #{i+1} — Adrien Liss")
                for i, p in enumerate(assets.get("fashion", []))
            ],
        },
        {
            "loc": f"{BASE}/real-estate.html",
            "priority": "0.9",
            "changefreq": "weekly",
            "images": [
                (to_full_url(p), f"Prime London Real Estate, Interior Design & Architectural Photography #{i+1} — Adrien Liss")
                for i, p in enumerate(assets.get("real_estate", []))
            ],
        },
        {
            "loc": f"{BASE}/events.html",
            "priority": "0.85",
            "changefreq": "weekly",
            "images": [
                (to_full_url(p), f"Corporate Event, Tech Summit & VIP Gala Photography London #{i+1} — Adrien Liss")
                for i, p in enumerate(assets.get("events", []))
            ],
        },
        {
            "loc": f"{BASE}/weddings.html",
            "priority": "0.9",
            "changefreq": "weekly",
            "images": [
                (to_full_url(p), f"Luxury Editorial & Fine Art Wedding Photography London & Europe #{i+1} — Adrien Liss")
                for i, p in enumerate(assets.get("weddings", []))
            ],
        },
        {
            "loc": f"{BASE}/video.html",
            "priority": "0.85",
            "changefreq": "monthly",
            "images": [
                (to_full_url("./:assets:weddings-events:/Events/_R0B2544.jpg"), "Commercial Video Production & Cinematic Showreels London — Adrien Liss"),
            ],
        },
        {
            "loc": f"{BASE}/blog.html",
            "priority": "0.9",
            "changefreq": "weekly",
            "images": [
                (to_full_url("./:assets:portraits:/Headshots:Portrait/_R0B7393.jpg"), "How to Prepare for Actor Headshots in London — Spotlight Guide by Adrien Liss"),
                (to_full_url("./:assets:portraits:/Headshots:Portrait/AL_04051.jpg"), "Dramatic Casting Archetype — Spotlight Actor Headshots London"),
                (to_full_url("./:assets:portraits:/Headshots:Portrait/_R0B5447.jpg"), "Contemporary Screen & Theatre Actor Portrait London — Adrien Liss"),
                (to_full_url("./:assets:portraits:/Headshots:Portrait/Corporate/3.jpg"), "Executive Corporate Headshots & Personal Branding Guide London — Adrien Liss"),
                (to_full_url("./:assets:portraits:/Headshots:Portrait/Corporate/5.jpg"), "Modern Business Portrait for LinkedIn & Press Releases London"),
                (to_full_url("./:assets:portraits:/Headshots:Portrait/Corporate/AL_00602.jpg"), "C-Suite & Advisory Leadership Portrait London — Adrien Liss"),
                (to_full_url("./:assets:weddings-events:/Weddings/_R0B6445.jpg"), "Editorial Wedding Photography in London & Europe Guide — Adrien Liss"),
                (to_full_url("./:assets:weddings-events:/Weddings/AL_07552.jpg"), "Unscripted Documentary Wedding Emotion London — Adrien Liss"),
                (to_full_url("./:assets:weddings-events:/Weddings/_R0B6395.jpeg"), "Luxury Bridal Couture & Fine Art Wedding Photography London"),
                (to_full_url("./:assets:fashion/Fashion/_MG_7706.jpeg"), "How to Build a Signed Model Portfolio & Agency Digitals in London — Adrien Liss"),
                (to_full_url("./:assets:fashion/Fashion/AL_07191.jpg"), "Studio Model Portfolio Test Shoot London — Adrien Liss"),
                (to_full_url("./:assets:fashion/Fashion/_R0B8902.jpg"), "High-Contrast Fashion Editorial Study London — Adrien Liss"),
                (to_full_url("./:assets:real-estate:/Real Estate/_DSC3500-HDR-2-Edit.jpg"), "Why Architectural & Interior Photography Dictates Prime London Property Value"),
                (to_full_url("./:assets:real-estate:/Real Estate/_DSC4350-HDR-2.jpg"), "Bespoke Interior Design & Conservatory Photography London — Adrien Liss"),
                (to_full_url("./:assets:real-estate:/Real Estate/_DSC3354-HDR-2.jpg"), "Prime London Property Living Space Architectural Photography — Adrien Liss"),
            ],
        },
        {
            "loc": f"{BASE}/about.html",
            "priority": "0.8",
            "changefreq": "monthly",
            "images": [
                (to_full_url("./assets/about-me/adrien-liss-portrait.jpg"), "Adrien Liss — Fine Art Photographer, Actor & Creative Strategist in London"),
            ],
        },
    ]

    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
        '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
    ]

    total_images = 0
    for page in pages:
        loc_esc = sax.escape(page["loc"])
        cf = page["changefreq"]
        pr = page["priority"]
        lines.append("  <url>")
        lines.append(f"    <loc>{loc_esc}</loc>")
        lines.append(f"    <lastmod>{TODAY}</lastmod>")
        lines.append(f"    <changefreq>{cf}</changefreq>")
        lines.append(f"    <priority>{pr}</priority>")
        for img_loc, img_title in page["images"]:
            total_images += 1
            iloc = sax.escape(img_loc)
            ititle = sax.escape(img_title)
            lines.append("    <image:image>")
            lines.append(f"      <image:loc>{iloc}</image:loc>")
            lines.append(f"      <image:title>{ititle}</image:title>")
            lines.append("    </image:image>")
        lines.append("  </url>")

    lines.append("</urlset>")
    open("sitemap.xml", "w", encoding="utf-8").write("\n".join(lines) + "\n")
    print(f"[OK] Generated sitemap.xml with {len(pages)} pages and {total_images} <image:image> entries!")

if __name__ == "__main__":
    main()
