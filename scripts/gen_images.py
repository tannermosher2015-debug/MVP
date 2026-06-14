#!/usr/bin/env python3
"""Generate art-directed luxury imagery for the Molokai site via Gemini.
Reads GEMINI_API_KEY from env. Saves PNGs into public/images/.
"""
import os
import sys
from pathlib import Path
from google import genai
from google.genai import types

OUT = Path(__file__).resolve().parent.parent / "public" / "images"
OUT.mkdir(parents=True, exist_ok=True)

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

JOBS = [
    (
        "hero-ai.png",
        "16:9",
        "Cinematic aerial drone photograph of a luxury oceanfront estate on the south "
        "shore of Molokai, Hawaii at golden hour. Low warm sun, long soft shadows, "
        "turquoise Pacific meeting black lava-rock reef, swaying coconut palms, a refined "
        "modern Hawaiian hale with a wide lanai and an infinity-edge pool, lush tropical "
        "greenery, distant green sea cliffs. Moody, sophisticated editorial real-estate "
        "photography, warm espresso and bronze tones, soft golden light, high dynamic "
        "range, ultra-detailed, photorealistic. No text, no logos, no watermarks, no people.",
    ),
    (
        "coastline-ai.png",
        "4:5",
        "Serene west-end Molokai coastline at dusk, a deserted golden-sand beach curving "
        "toward distant sea cliffs, calm Pacific reflecting a warm amber and rose sunset "
        "sky, a few coconut palms in silhouette. Cinematic editorial landscape "
        "photography, warm tones, tranquil and luxurious, ultra-detailed, photorealistic. "
        "No text, no people.",
    ),
    (
        "exterior-ai.png",
        "4:3",
        "Refined island luxury home exterior on Molokai at golden hour, contemporary "
        "Hawaiian architecture with a deep lanai, natural wood and lava stone, large glass "
        "sliding doors open to an ocean view, manicured tropical landscaping, warm low sun. "
        "Architectural Digest style, sophisticated, ultra-detailed, photorealistic. "
        "No text, no people.",
    ),
    (
        "interior-ai.png",
        "4:3",
        "Luxury island living room interior on Molokai opening onto an oceanfront lanai, "
        "floor-to-ceiling glass with a turquoise Pacific view, natural materials of teak, "
        "rattan, linen and stone, warm golden-hour light. Elegant minimal Hawaiian luxury, "
        "editorial interior photography, warm espresso and ivory palette, ultra-detailed, "
        "photorealistic. No text, no people.",
    ),
]


def extract_image(resp):
    for cand in resp.candidates or []:
        for part in (cand.content.parts if cand.content else []) or []:
            data = getattr(part, "inline_data", None)
            if data and data.data:
                return data.data
    return None


def generate(prompt, aspect):
    # Strategy A: Nano Banana Pro with aspect ratio
    try:
        resp = client.models.generate_content(
            model="gemini-3-pro-image-preview",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_modalities=["IMAGE"],
                image_config=types.ImageConfig(aspect_ratio=aspect),
            ),
        )
        img = extract_image(resp)
        if img:
            return img, "pro"
    except Exception as e:
        print(f"   pro failed: {type(e).__name__}: {str(e)[:120]}")
    # Strategy B: Flash image with aspect ratio
    try:
        resp = client.models.generate_content(
            model="gemini-2.5-flash-image",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_modalities=["IMAGE"],
                image_config=types.ImageConfig(aspect_ratio=aspect),
            ),
        )
        img = extract_image(resp)
        if img:
            return img, "flash+aspect"
    except Exception as e:
        print(f"   flash+aspect failed: {type(e).__name__}: {str(e)[:120]}")
    # Strategy C: Flash image plain
    try:
        resp = client.models.generate_content(
            model="gemini-2.5-flash-image", contents=prompt
        )
        img = extract_image(resp)
        if img:
            return img, "flash"
    except Exception as e:
        print(f"   flash failed: {type(e).__name__}: {str(e)[:120]}")
    return None, None


def main():
    only = sys.argv[1] if len(sys.argv) > 1 else None
    for name, aspect, prompt in JOBS:
        if only and only not in name:
            continue
        print(f"-> {name} ({aspect})")
        img, how = generate(prompt, aspect)
        if img:
            (OUT / name).write_bytes(img)
            print(f"   OK [{how}] {len(img)//1024} KB -> {name}")
        else:
            print(f"   FAILED {name}")


if __name__ == "__main__":
    main()
