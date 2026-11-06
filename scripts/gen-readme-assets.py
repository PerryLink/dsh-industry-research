#!/usr/bin/env python3
"""Generate the README image assets for dsh-industry-research.

Outputs (idempotent overwrite) under docs/assets/:
  dsh-industry-research-hero-{zh,en}-{light,dark}.webp   1440x576 raster
  dsh-industry-research-flow-v5-{light,dark}.svg         1100x660 vector

Hero: left column kicker / title / two value lines / subtitle / meta / footer.
Right column: a teaching-fixture research dossier — a three-tier chain (one
sourced metric, two explicit gaps), the evidence register, the 4/4 delivery
contract and the two report delivery paths. The fixture numbers are the ones
documented in README.md / fixtures/baijiu (fictional teaching material).

Flow: the real pipeline, not a five-box row:
  three stacked producers (industry_map / industry_track / company_scan)
  -> one evidence register (E-chain / E-timeline / E-company-<slug>)
  -> the industry_report contract gate (delivery contract + deterministic
     adversarial check + optional ctx.jobs notes)
  -> two outlets (ctx.researchReport sealed path | builtin-fallback)
  + a versions.jsonl ledger tape at the bottom (map / scan / report append;
     read-time hash verification).
Dashed strokes everywhere mean "optional capability looked up at run time,
never injected": ctx.web on the producers, ctx.jobs on the gate.

Run:  python scripts/gen-readme-assets.py
Requires Pillow + msyh.ttc / msyhbd.ttc / consola.ttf / segoeui(b).ttf.
"""

from __future__ import annotations

import os

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "docs", "assets")

FONT_CJK = r"C:\Windows\Fonts\msyh.ttc"
FONT_CJK_BOLD = r"C:\Windows\Fonts\msyhbd.ttc"
FONT_MONO = r"C:\Windows\Fonts\consola.ttf"
FONT_EN = r"C:\Windows\Fonts\segoeui.ttf"
FONT_EN_BOLD = r"C:\Windows\Fonts\segoeuib.ttf"

for _path in (FONT_CJK, FONT_CJK_BOLD, FONT_MONO, FONT_EN, FONT_EN_BOLD):
    if not os.path.exists(_path):
        raise SystemExit(f"FATAL: font missing: {_path}")

WARNINGS: list[str] = []

# --- family palette ---------------------------------------------------------
SKIN = {
    "light": dict(
        bg_from="#f9f6fd", bg_to="#e4eaf8", card="#ffffff",
        card_edge="#e3dfee", zone="#f7f4fc", zone_edge="#e5e0f1",
        text="#171a2b", sub="#4d5261", faint="#8b90a1",
        accent="#4B67B4", accent_soft="#ece9f8", on_accent="#ffffff",
        good="#1f8a5b", good_bg="#e8f6ee",
        warn="#a86a1a", warn_bg="#fbf1de",
        grid="#e7e4f0", shadow=(32, 26, 64), shadow_hex="#201a40",
    ),
    "dark": dict(
        bg_from="#131a2a", bg_to="#0c1016", card="#1b2231",
        card_edge="#2e374b", zone="#171e2d", zone_edge="#2b3448",
        text="#f0f3f9", sub="#a8b1c4", faint="#737b8d",
        accent="#8496f5", accent_soft="#242d42", on_accent="#101726",
        good="#3fb950", good_bg="#16301f",
        warn="#f4bd6a", warn_bg="#33280f",
        grid="#1e2636", shadow=(0, 0, 0), shadow_hex="#000000",
    ),
}

HERO = {
    "zh": dict(
        kicker="dsh-industry-research · 行业研究",
        title="行业研究可核查",
        value=["四个工具，一条可回放的证据链",
               "每个数字带来源与日期，缺口如实声明"],
        sub="产业链图 → 政策时间线 → 公司卡 → 可核查报告",
        meta="只读公开源 · 不接交易 · 不预测价格 · 不构成投资建议",
        foot="Apache-2.0 · PerryLink DSH plugin family",
        foot2="DSH ≥0.2.1 <0.3.0 · node ^22.19 || ≥24.9",
        card=dict(
            kicker1="EVIDENCE DOSSIER", kicker2=" · 教学样例 · 数字虚构",
            path="industryRoot/白酒/",
            title="白酒 · 产业链证据",
            left_head="产业链结构", left_tag="chain.json",
            right_head="证据登记", right_tag="assemble()",
            tiers=[
                ("上游", "高粱种植", "价格 10 元 · S1 · 2026-01-01", True),
                ("中游", "酿造", "产量 待补", False),
                ("下游", "渠道", "占比 待补", False),
            ],
            foot="3 节点 · 2 缺口 · 1 来源",
            evidence=[("E-chain", "chain.json"),
                      ("E-timeline", "timeline.jsonl"),
                      ("E-company-<slug>", "card.json")],
            contract="交付契约", contract_badge="4/4",
            checks=["区块齐全", "来源/日期校验", "占位符 0", "claims→证据"],
            red="红方审阅 + 正反方", jobs="ctx.jobs?",
            delivery_label="industry_report · 报告交付",
            path1="reports/<YYYYMMDD-HHmmss>/report.md",
            path2="+ manifest.json · SHA-256 来源回溯",
            prov="versions.jsonl 版本账本",
            sealed="sealed", sealed_text="ctx.researchReport",
            fb="fallback", fb_text="builtin-fallback",
            engine_note="引擎挂载 / 缺席",
        ),
    ),
    "en": dict(
        kicker="dsh-industry-research · research pack",
        title="Industry research",
        value=["Every number sourced and dated",
               "Every gap declared, never filled"],
        sub="chain map → policy timeline → company cards → report",
        meta="public sources only · no trading · no forecasts · not advice",
        foot="Apache-2.0 · PerryLink DSH plugin family",
        foot2="DSH ≥0.2.1 <0.3.0 · node ^22.19 || ≥24.9",
        card=dict(
            kicker1="EVIDENCE DOSSIER", kicker2=" · TEACHING FIXTURE · FICTIONAL NUMBERS",
            path="industryRoot/baijiu/",
            title="Baijiu · chain evidence",
            left_head="chain structure", left_tag="chain.json",
            right_head="evidence register", right_tag="assemble()",
            tiers=[
                ("UPSTREAM", "sorghum", "price 10 CNY · S1 · 2026-01-01", True),
                ("MIDSTREAM", "brewing", "production — pending", False),
                ("DOWNSTREAM", "channels", "share — pending", False),
            ],
            foot="3 nodes · 2 gaps · 1 source",
            evidence=[("E-chain", "chain.json"),
                      ("E-timeline", "timeline.jsonl"),
                      ("E-company-<slug>", "card.json")],
            contract="delivery contract", contract_badge="4/4",
            checks=["blocks complete", "source/asOf check", "placeholders 0",
                    "claims→evidence"],
            red="red review + bull/bear", jobs="ctx.jobs?",
            delivery_label="industry_report · DELIVERY",
            path1="reports/<YYYYMMDD-HHmmss>/report.md",
            path2="+ manifest.json · SHA-256 provenance",
            prov="versions.jsonl ledger",
            sealed="sealed", sealed_text="ctx.researchReport",
            fb="fallback", fb_text="builtin-fallback",
            engine_note="engine mounted / absent",
        ),
    ),
}


# --- small raster helpers ---------------------------------------------------
def font(size, kind="cjk"):
    return ImageFont.truetype(
        {"cjk": FONT_CJK, "cjk_bold": FONT_CJK_BOLD, "mono": FONT_MONO,
         "en": FONT_EN, "en_bold": FONT_EN_BOLD}[kind], max(8, int(size)))


def hx(value):
    value = value.lstrip("#")
    return tuple(int(value[i:i + 2], 16) for i in (0, 2, 4))


def gradient(w, h, c1, c2):
    img = Image.new("RGB", (w, h))
    d = ImageDraw.Draw(img)
    for y in range(h):
        t = 0.25 * (y / h) + 0.75 * (y / h) ** 1.6
        d.line([(0, y), (w, y)],
               fill=tuple(int(p + (q - p) * t) for p, q in zip(hx(c1), hx(c2))))
    return img


def glow(img, cx, cy, r, color, alpha=40):
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    for i in range(10, 0, -1):
        rr = r * i / 10
        d.ellipse([cx - rr, cy - rr, cx + rr, cy + rr],
                  fill=color + (int(alpha * (1 - i / 11)),))
    return Image.alpha_composite(img.convert("RGBA"), layer).convert("RGB")


def card(img, box, skin, radius=22, shadow=28):
    x0, y0, x1, y1 = box
    sh = Image.new("RGBA", img.size, (0, 0, 0, 0))
    sd = ImageDraw.Draw(sh)
    for i in range(shadow, 0, -3):
        sd.rounded_rectangle([x0 - i // 5, y0 + i // 2, x1 + i // 5, y1 + i],
                             radius=radius + i // 5,
                             fill=skin["shadow"] + (int(7 * (1 - i / shadow)),))
    base = Image.alpha_composite(
        img.convert("RGBA"), sh.filter(ImageFilter.GaussianBlur(13)))
    d = ImageDraw.Draw(base)
    d.rounded_rectangle(box, radius=radius, fill=hx(skin["card"]),
                        outline=hx(skin["card_edge"]), width=2)
    return base.convert("RGB")


def fit(d, text, kind, max_w, size, min_size=14):
    size = int(size)
    while size > min_size:
        if d.textlength(text, font=font(size, kind)) <= max_w:
            return size
        size -= 2
    return max(min_size, size)


def write(img, xy, text, skin, size, kind="cjk", color="text",
          max_w=None, min_size=14, tag="", anchor=None):
    d = ImageDraw.Draw(img)
    if max_w is not None:
        size = fit(d, text, kind, max_w, size, min_size)
        if d.textlength(text, font=font(size, kind)) > max_w:
            WARNINGS.append(f"{tag}: {text!r} exceeds {max_w}px at {size}px")
            print(f"WARN {tag}: {text!r} exceeds {max_w}px at {size}px")
    d.text(xy, text, font=font(size, kind), fill=hx(skin[color]), anchor=anchor)
    return size


def pill(img, xy, text, skin, size=19, kind="cjk_bold",
         fg="accent", bg="accent_soft", pad_x=18, pad_y=10):
    d = ImageDraw.Draw(img)
    f = font(size, kind)
    tw = d.textlength(text, font=f)
    x, y = xy
    h = size + pad_y * 2
    d.rounded_rectangle([x, y, x + tw + pad_x * 2, y + h], radius=h // 2,
                        fill=hx(skin[bg]))
    d.text((x + pad_x, y + pad_y - 1), text, font=f, fill=hx(skin[fg]))
    return img, x + tw + pad_x * 2


def dash_line(d, x1, y1, x2, y2, color, width=2, dash=6, gap=5):
    if abs(y2 - y1) < 0.1:
        x = x1
        while x < x2:
            d.line([(x, y1), (min(x + dash, x2), y2)], fill=color, width=width)
            x += dash + gap
    else:
        y = y1
        while y < y2:
            d.line([(x1, y), (x2, min(y + dash, y2))], fill=color, width=width)
            y += dash + gap


def dashed_rrect(d, box, radius, color, width=2, dash=7, gap=5):
    x0, y0, x1, y1 = box
    r = radius
    dash_line(d, x0 + r, y0, x1 - r, y0, color, width, dash, gap)
    dash_line(d, x0 + r, y1, x1 - r, y1, color, width, dash, gap)
    dash_line(d, x0, y0 + r, x0, y1 - r, color, width, dash, gap)
    dash_line(d, x1, y0 + r, x1, y1 - r, color, width, dash, gap)
    d.arc([x0, y0, x0 + 2 * r, y0 + 2 * r], 180, 270, fill=color, width=width)
    d.arc([x1 - 2 * r, y0, x1, y0 + 2 * r], 270, 360, fill=color, width=width)
    d.arc([x1 - 2 * r, y1 - 2 * r, x1, y1], 0, 90, fill=color, width=width)
    d.arc([x0, y1 - 2 * r, x0 + 2 * r, y1], 90, 180, fill=color, width=width)


def check_icon(d, cx, cy, r, skin, good=True):
    if good:
        d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=hx(skin["good_bg"]))
        d.line([cx - r * 0.45, cy, cx - r * 0.1, cy + r * 0.38],
               fill=hx(skin["good"]), width=max(2, int(r * 0.28)))
        d.line([cx - r * 0.1, cy + r * 0.38, cx + r * 0.5, cy - r * 0.42],
               fill=hx(skin["good"]), width=max(2, int(r * 0.28)))
    else:
        d.ellipse([cx - r, cy - r, cx + r, cy + r],
                  outline=hx(skin["warn"]), width=2)
        d.ellipse([cx - 2, cy - 2, cx + 2, cy + 2], fill=hx(skin["warn"]))


def check_display(canvas_px, minimum_displayed, tag):
    displayed = canvas_px * 880 / 1440
    if displayed < minimum_displayed:
        WARNINGS.append(
            f"{tag}: {canvas_px}px renders at {displayed:.1f}px on GitHub "
            f"(< {minimum_displayed}px)")
        print(f"WARN {tag}: {canvas_px}px renders at {displayed:.1f}px")


# ---------------------------------------------------------------------------
# Hero 1440x576
# ---------------------------------------------------------------------------
def hero(lang, skin_name):
    s = SKIN[skin_name]
    m = HERO[lang]
    zh = lang == "zh"
    w, h = 1440, 576
    img = gradient(w, h, s["bg_from"], s["bg_to"])
    img = glow(img, 1230, 20, 430, hx(s["accent"]),
               16 if skin_name == "light" else 30)
    img = glow(img, 90, 570, 300, hx(s["accent"]),
               8 if skin_name == "light" else 12)

    # ------------------------------------------------------------- left copy
    img, _ = pill(img, (60, 52), m["kicker"], s, size=19,
                  kind="cjk_bold" if zh else "en_bold", pad_x=20, pad_y=10)

    d = ImageDraw.Draw(img)
    title_kind = "cjk_bold" if zh else "en_bold"
    tsize = fit(d, m["title"], title_kind, 660, 88 if zh else 82, 78)
    check_display(tsize, 48, f"hero.{lang}.title")
    d.text((60, 116), m["title"], font=font(tsize, title_kind),
           fill=hx(s["text"]))

    vkind = "cjk_bold" if zh else "en_bold"
    vsize = 34
    for line in m["value"]:
        vsize = min(vsize, fit(d, line, vkind, 660, vsize, 24))
    for i, line in enumerate(m["value"]):
        write(img, (60, 250 + i * 48), line, s, vsize, vkind,
              "text", 660, 24, f"hero.{lang}.value{i}")
    check_display(vsize, 17, f"hero.{lang}.value")

    sub_size = write(img, (60, 364), m["sub"], s, 26,
                     "cjk" if zh else "en", "sub", 660, 22,
                     f"hero.{lang}.sub")
    check_display(sub_size, 15, f"hero.{lang}.sub")

    meta_size = write(img, (60, 410), m["meta"], s, 20,
                      "cjk" if zh else "en", "faint", 660, 17,
                      f"hero.{lang}.meta")
    check_display(meta_size, 12, f"hero.{lang}.meta")

    d = ImageDraw.Draw(img)
    d.line([60, 450, 720, 450], fill=hx(s["grid"]), width=2)
    write(img, (60, 462), m["foot"], s, 20, "en", "faint", 660, 17,
          f"hero.{lang}.foot")
    write(img, (60, 490), m["foot2"], s, 20, "en", "faint", 660, 16,
          f"hero.{lang}.foot2")

    # ---------------------------------------- right: teaching-fixture dossier
    c = m["card"]
    img = card(img, (744, 42, 1392, 534), s, radius=22)
    d = ImageDraw.Draw(img)

    # header
    kick_size = 14
    write(img, (770, 62), c["kicker1"], s, kick_size, "mono", "accent",
          None, 12, f"hero.{lang}.kicker1")
    kw = d.textlength(c["kicker1"], font=font(kick_size, "mono"))
    write(img, (770 + kw, 64), c["kicker2"], s, 13,
          "cjk" if zh else "en_bold", "faint", None, 11,
          f"hero.{lang}.kicker2")
    d.text((1366, 64), c["path"],
           font=font(12, "cjk" if zh else "mono"),
           fill=hx(s["faint"]), anchor="ra")
    write(img, (770, 84), c["title"], s, 24,
          "cjk_bold" if zh else "en_bold", "text", 470, 19,
          f"hero.{lang}.card_title")
    d.line([770, 120, 1366, 120], fill=hx(s["grid"]), width=2)

    # column headings
    write(img, (770, 130), c["left_head"], s, 13,
          "cjk_bold" if zh else "en_bold", "accent", 180, 11,
          f"hero.{lang}.left_head")
    d.text((1070, 132), c["left_tag"], font=font(10.5, "mono"),
           fill=hx(s["faint"]), anchor="ra")
    write(img, (1090, 130), c["right_head"], s, 13,
          "cjk_bold" if zh else "en_bold", "accent", 160, 11,
          f"hero.{lang}.right_head")
    d.text((1366, 132), c["right_tag"], font=font(10.5, "mono"),
           fill=hx(s["faint"]), anchor="ra")

    # chain spine + three tiers
    spine_x = 784
    d.line([spine_x, 164, spine_x, 350], fill=hx(s["zone_edge"]), width=2)
    row_ys = (150, 224, 298)
    centers = [y + 33 for y in row_ys]
    for cy in centers:
        d.ellipse([spine_x - 4, cy - 4, spine_x + 4, cy + 4],
                  fill=hx(s["accent"]))
    for i, (tier, node, metric, sourced) in enumerate(c["tiers"]):
        y = row_ys[i]
        box = (800, y, 1070, y + 66)
        d.rounded_rectangle(box, radius=12, fill=hx(s["zone"]),
                            outline=hx(s["zone_edge"]), width=2)
        # slight accent rail on the left of each tier row
        d.rounded_rectangle([800, y + 8, 805, y + 58], radius=2,
                            fill=hx(s["warn"] if not sourced else s["accent"]))
        label = f"{tier} · {node}" if zh else f"{tier} · {node}"
        write(img, (816, y + 8), label, s, 15,
              "cjk_bold" if zh else "en_bold", "text", 224, 12,
              f"hero.{lang}.tier{i}.label")
        mcolor = "warn" if not sourced else "sub"
        write(img, (816, y + 32), metric, s, 12,
              "cjk" if zh else "en", mcolor, 218, 10.5,
              f"hero.{lang}.tier{i}.metric")
        if sourced:
            check_icon(d, 1046, y + 33, 9, s, True)
        else:
            # explicit empty slot: a dashed amber square, never a check
            gx0, gy0, gx1, gy1 = 1037, y + 24, 1056, y + 43
            dash_line(d, gx0, gy0, gx1, gy0, hx(s["warn"]), 2, 4, 3)
            dash_line(d, gx0, gy1, gx1, gy1, hx(s["warn"]), 2, 4, 3)
            dash_line(d, gx0, gy0, gx0, gy1, hx(s["warn"]), 2, 4, 3)
            dash_line(d, gx1, gy0, gx1, gy1, hx(s["warn"]), 2, 4, 3)
        # connector from spine to row
        d.line([spine_x, centers[i], 800, centers[i]],
               fill=hx(s["zone_edge"]), width=2)
    write(img, (770, 378), c["foot"], s, 11.5,
          "cjk" if zh else "en", "faint", 290, 10,
          f"hero.{lang}.chain_foot")

    # vertical divider between the two dossier columns
    d.line([1080, 128, 1080, 386], fill=hx(s["grid"]), width=2)

    # evidence register
    ev_ys = (150, 190, 230)
    for i, (eid, origin) in enumerate(c["evidence"]):
        y = ev_ys[i]
        write(img, (1090, y + 6), eid, s, 12.5, "mono", "text", 150, 10,
              f"hero.{lang}.evidence{i}.id")
        d.text((1338, y + 8), f"{origin} · sha256",
               font=font(10.5, "mono"),
               fill=hx(s["faint"]), anchor="ra")
        check_icon(d, 1352, y + 16, 7, s, True)
        d.line([1090, y + 34, 1366, y + 34], fill=hx(s["grid"]), width=1)

    # contract block
    write(img, (1090, 278), c["contract"], s, 13,
          "cjk_bold" if zh else "en_bold", "accent", 160, 11,
          f"hero.{lang}.contract")
    badge = c["contract_badge"]
    bf = font(10.5, "mono")
    bw = d.textlength(badge, font=bf) + 20
    d.rounded_rectangle([1366 - bw, 274, 1366, 296], radius=11,
                        fill=hx(s["good_bg"]))
    d.text((1366 - bw / 2, 280), badge, font=bf, fill=hx(s["good"]),
           anchor="ma")
    cell_x = (1092, 1232)
    cell_y = (306, 332)
    for i, check in enumerate(c["checks"]):
        cx = cell_x[i % 2]
        cy = cell_y[i // 2]
        check_icon(d, cx + 7, cy + 8, 7, s, True)
        write(img, (cx + 20, cy), check, s, 11.5,
              "cjk" if zh else "en", "sub", 112, 10,
              f"hero.{lang}.check{i}")

    # optional ctx.jobs note
    write(img, (1090, 356), c["red"], s, 11.5,
          "cjk" if zh else "en", "sub", 150, 10,
          f"hero.{lang}.red")
    jw = d.textlength(c["jobs"], font=font(11, "mono")) + 16
    dashed_rrect(d, (1366 - jw, 350, 1366, 372), 8, hx(s["accent"]), 1, 4, 3)
    d.text((1366 - jw / 2, 354), c["jobs"], font=font(11, "mono"),
           fill=hx(s["accent"]), anchor="ma")

    # delivery footer block
    d.rounded_rectangle([770, 390, 1366, 508], radius=14,
                        fill=hx(s["zone"]), outline=hx(s["zone_edge"]), width=2)
    write(img, (790, 400), c["delivery_label"], s, 10.5,
          "cjk_bold" if zh else "en_bold", "accent", None, 9,
          f"hero.{lang}.delivery_label")
    write(img, (790, 422), c["path1"], s, 12.5, "mono", "text", 330, 10,
          f"hero.{lang}.path1")
    write(img, (790, 444), c["path2"], s, 11.5,
          "cjk" if zh else "mono", "sub", 330, 10,
          f"hero.{lang}.path2")
    write(img, (790, 468), c["prov"], s, 11.5,
          "cjk" if zh else "en", "faint", 330, 10,
          f"hero.{lang}.prov")

    # engine chips (the two delivery paths)
    def engine_chip(y, tag, text, fg, bg, dashed=False):
        tf = font(10.5, "mono")
        tw = d.textlength(tag, font=tf) + 18
        d.rounded_rectangle([1136, y, 1136 + tw, y + 22], radius=11,
                            fill=hx(s[bg]))
        d.text((1136 + 9, y + 4), tag, font=tf, fill=hx(s[fg]))
        if dashed:
            dashed_rrect(d, (1128, y - 1, 1136 + tw + 1, y + 23), 11,
                         hx(s["accent"]), 1, 4, 3)
        d.text((1136 + tw + 8, y + 4), text, font=font(11, "mono"),
               fill=hx(s[fg] if dashed else s["text"]))
        return 1136 + tw + 8 + d.textlength(text, font=font(11, "mono"))

    end1 = engine_chip(398, c["sealed"], c["sealed_text"], "good", "good_bg",
                       dashed=True)
    end2 = engine_chip(426, c["fb"], c["fb_text"], "warn", "warn_bg")
    if max(end1, end2) > 1362:
        WARNINGS.append(f"hero.{lang}: engine chips overflow to "
                        f"{max(end1, end2)} > 1362")
        print(f"WARN hero.{lang}: engine chips overflow")
    write(img, (1136, 456), c["engine_note"], s, 10.5,
          "cjk" if zh else "en", "faint", 230, 9,
          f"hero.{lang}.engine_note")

    path = os.path.join(OUT, f"dsh-industry-research-hero-{lang}-{skin_name}.webp")
    img.save(path, "WEBP", quality=92, method=6)
    print(f"wrote dsh-industry-research-hero-{lang}-{skin_name}.webp")


# ---------------------------------------------------------------------------
# Flow 1100x660 (hand-written SVG, light + dark)
# ---------------------------------------------------------------------------
FLOW_W, FLOW_H = 1100, 660


def esc(text):
    return (text.replace("&", "&amp;").replace("<", "&lt;")
            .replace(">", "&gt;").replace('"', "&quot;"))


def svg_width(text, size, mono=False):
    f = ImageFont.truetype(FONT_MONO if mono else FONT_EN,
                           max(8, int(round(size))))
    return f.getlength(text)


def flow_svg(skin_name):
    s = SKIN[skin_name]
    parts = []
    add = parts.append

    def T(x, y, text, size, fill, mono=False, weight=400, anchor="start",
          max_w=None, tag="", opacity=None, ls=None):
        width = svg_width(text, size, mono)
        if max_w is not None and width > max_w:
            WARNINGS.append(f"flow.{skin_name}.{tag}: {text!r} {width:.1f}px "
                            f"> {max_w}px")
            print(f"WARN flow.{skin_name}.{tag}: {text!r} "
                  f"{width:.1f}px > {max_w}px")
        attrs = [
            f'x="{x:.1f}"', f'y="{y:.1f}"', f'fill="{fill}"',
            f'font-size="{size}"',
            'font-family="Segoe UI, Microsoft YaHei, ui-sans-serif, '
            'system-ui, sans-serif"' if not mono else
            'font-family="Cascadia Mono, Consolas, ui-monospace, monospace"',
        ]
        if weight != 400:
            attrs.append(f'font-weight="{weight}"')
        if anchor != "start":
            attrs.append(f'text-anchor="{anchor}"')
        if opacity is not None:
            attrs.append(f'opacity="{opacity}"')
        if ls is not None:
            attrs.append(f'letter-spacing="{ls}"')
        add(f'<text {" ".join(attrs)}>{esc(text)}</text>')
        return width

    def box(x, y, w, h, r=18, fill=None, stroke=None, sw=1.5, dash=None,
            shadow=True, opacity=None):
        attrs = [f'x="{x}"', f'y="{y}"', f'width="{w}"', f'height="{h}"',
                 f'rx="{r}"']
        if fill is not None:
            attrs.append(f'fill="{fill}"')
        else:
            attrs.append('fill="none"')
        if stroke is not None:
            attrs.append(f'stroke="{stroke}"')
            attrs.append(f'stroke-width="{sw}"')
        if dash is not None:
            attrs.append(f'stroke-dasharray="{dash}"')
        if shadow:
            attrs.append('filter="url(#soft)"')
        if opacity is not None:
            attrs.append(f'opacity="{opacity}"')
        add(f'<rect {" ".join(attrs)}/>')

    def line(x1, y1, x2, y2, color, width=2, dash=None, cap="round",
             opacity=None):
        attrs = [f'x1="{x1}"', f'y1="{y1}"', f'x2="{x2}"', f'y2="{y2}"',
                 f'stroke="{color}"', f'stroke-width="{width}"',
                 f'stroke-linecap="{cap}"']
        if dash is not None:
            attrs.append(f'stroke-dasharray="{dash}"')
        if opacity is not None:
            attrs.append(f'opacity="{opacity}"')
        add(f'<line {" ".join(attrs)}/>')

    def path(d, color, width=2, dash=None, fill="none", cap="round",
             join="round"):
        attrs = [f'd="{d}"', f'fill="{fill}"', f'stroke="{color}"',
                 f'stroke-width="{width}"', f'stroke-linecap="{cap}"',
                 f'stroke-linejoin="{join}"']
        if dash is not None:
            attrs.append(f'stroke-dasharray="{dash}"')
        add(f'<path {" ".join(attrs)}/>')

    def head_right(x, y, color, size=7):
        add(f'<path d="M{x - size} {y - size * 0.62} L{x} {y} '
            f'L{x - size} {y + size * 0.62} Z" fill="{color}"/>')

    def head_down(x, y, color, size=7):
        add(f'<path d="M{x - size * 0.62} {y - size} L{x} {y} '
            f'L{x + size * 0.62} {y - size} Z" fill="{color}"/>')

    def check(cx, cy, color, good=True, r=7):
        if good:
            add(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{s["good_bg"]}"/>')
            d = (f'M{cx - r * 0.5:.1f} {cy:.1f} l{r * 0.34:.1f} {r * 0.34:.1f} '
                 f'l{r * 0.66:.1f} -{r * 0.72:.1f}')
            path(d, color, max(1.6, r * 0.28))
        else:
            add(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" '
                f'stroke="{s["warn"]}" stroke-width="1.6"/>')
            add(f'<circle cx="{cx}" cy="{cy}" r="1.8" fill="{s["warn"]}"/>')

    def chip(x, y, text, size=11, fg=None, bg=None, pad=8, mono=True,
             dash=None, h=22):
        fg = fg or s["accent"]
        bg = bg or s["accent_soft"]
        w = svg_width(text, size, mono) + pad * 2
        attrs = [f'x="{x}"', f'y="{y}"', f'width="{w:.1f}"', f'height="{h}"',
                 f'rx="{h // 2}"', f'fill="{bg}"']
        if dash is not None:
            attrs.append(f'stroke="{fg}"')
            attrs.append('stroke-width="1.2"')
            attrs.append(f'stroke-dasharray="{dash}"')
        add(f'<rect {" ".join(attrs)}/>')
        T(x + pad, y + h / 2 + size * 0.36, text, size, fg, mono=mono)
        return w

    # ---------------------------------------------------------------- canvas
    add(f'<svg xmlns="http://www.w3.org/2000/svg" width="{FLOW_W}" '
        f'height="{FLOW_H}" viewBox="0 0 {FLOW_W} {FLOW_H}" role="img" '
        f'aria-label="dsh-industry-research structure: three producers '
        f'(industry_map, industry_track, company_scan) converge into one '
        f'evidence register (E-chain, E-timeline, E-company-&lt;slug&gt;), '
        f'pass the industry_report contract gate (delivery contract plus a '
        f'deterministic adversarial check and optional ctx.jobs notes), and '
        f'leave through two outlets (ctx.researchReport sealed path or '
        f'builtin-fallback); a versions.jsonl ledger tape records each write '
        f'and verifies the hash on read">')
    add('<title>dsh-industry-research: three producers, one contract gate, '
        'two deliveries</title>')
    add('<defs>')
    add(f'<linearGradient id="bg" x1="0" y1="0" x2="0.4" y2="1">'
        f'<stop offset="0" stop-color="{s["bg_from"]}"/>'
        f'<stop offset="1" stop-color="{s["bg_to"]}"/></linearGradient>')
    add('<filter id="soft" x="-25%" y="-25%" width="150%" height="160%">'
        '<feDropShadow dx="0" dy="6" stdDeviation="9" '
        f'flood-color="{s["shadow_hex"]}" '
        'flood-opacity="0.13"/></filter>')
    add(f'<pattern id="rules" width="10" height="30" '
        f'patternUnits="userSpaceOnUse"><path d="M0 29.5H10" '
        f'stroke="{s["grid"]}" stroke-width="1"/></pattern>')
    add('</defs>')
    add(f'<rect width="{FLOW_W}" height="{FLOW_H}" fill="url(#bg)"/>')
    add(f'<rect width="{FLOW_W}" height="{FLOW_H}" fill="url(#rules)" '
        f'opacity="0.45"/>')

    # ---------------------------------------------------------------- header
    T(44, 48, "DSH- INDUSTRY-RESEARCH · STRUCTURE", 11, s["accent"],
      mono=True, ls="1.4", tag="eyebrow", max_w=300)
    T(44, 76, "Three producers · one contract gate · two deliveries", 21,
      s["text"], weight=700, tag="title", max_w=660)
    T(44, 98, "research only · public sources · a source and a date on every "
      "value", 12, s["sub"], tag="subtitle", max_w=650)
    T(1056, 48, "4 tools · 2 skills · 1 gate", 11, s["faint"],
      anchor="end", tag="scope", max_w=180)

    # legend (top right)
    lx, ly = 712, 58
    line(lx, ly - 4, lx + 26, ly - 4, s["accent"], 2)
    T(lx + 34, ly, "main path", 11, s["sub"], tag="legend1", max_w=100)
    line(lx, ly + 18, lx + 26, ly + 18, s["accent"], 2, dash="4 4")
    T(lx + 34, ly + 22, "optional seam · runtime lookup", 11, s["sub"],
      tag="legend2", max_w=190)
    add(f'<rect x="{lx + 8}" y="{ly + 32}" width="9" height="9" rx="2" '
        f'fill="{s["accent"]}"/>')
    T(lx + 34, ly + 44, "artifact on disk", 11, s["sub"], tag="legend3",
      max_w=120)

    line(44, 114, 1056, 114, s["grid"], 1.5)

    # ------------------------------------------------------- producer stack
    T(44, 136, "PRODUCERS · artifacts under industryRoot/<industry>/", 11,
      s["accent"], mono=True, ls="1.1", tag="producers_label", max_w=430)

    producers = [
        dict(tool="industry_map",
             seam="ctx.web?", seam_required=False,
             role="validate tiers, edges and metric slots",
             rule="value ⇒ sourceRef + asOf · no value = gap",
             chips=["chain.json", "sources.json", "chain.svg?"]),
        dict(tool="industry_track",
             seam="ctx.web required", seam_required=True,
             role="search, filter by host, snapshot pages",
             rule="host allow/block · since · offline:true · 6 categories",
             chips=["timeline.jsonl"]),
        dict(tool="company_scan",
             seam="ctx.web?", seam_required=False,
             role="read local files: outline, figures, hash",
             rule="status+asOf · ticker · metrics source+asOf · batch",
             chips=["card.json", "card.md"]),
    ]
    card_ys = (148, 280, 412)
    card_h = 118
    centers = [y + card_h // 2 for y in card_ys]
    for i, (p, y) in enumerate(zip(producers, card_ys)):
        box(44, y, 386, card_h, 18, s["card"], s["card_edge"], 1.5)
        # accent rail
        add(f'<rect x="44" y="{y + 12}" width="4" height="{card_h - 24}" '
            f'rx="2" fill="{s["accent"]}" opacity="0.85"/>')
        T(64, y + 30, p["tool"], 15, s["text"], mono=True, weight=700,
          tag=f"prod{i}.tool", max_w=165)
        # optional seam chip, right aligned
        sw = svg_width(p["seam"], 11, True) + 16
        chip(412 - sw, y + 14, p["seam"], 11,
             s["accent"], s["accent_soft"], dash="4 3", h=20)
        T(64, y + 56, p["role"], 12.5, s["sub"], tag=f"prod{i}.role",
          max_w=340)
        T(64, y + 77, p["rule"], 11, s["warn"], tag=f"prod{i}.rule",
          max_w=350)
        cx = 64
        for j, label in enumerate(p["chips"]):
            cw = chip(cx, y + 88, label, 11,
                      s["accent"] if j == 0 else s["sub"],
                      s["accent_soft"] if j == 0 else s["zone"])
            cx += cw + 6
        if cx > 418:
            WARNINGS.append(f"flow.{skin_name}.prod{i}: chips overflow to {cx}")
            print(f"WARN flow.{skin_name}.prod{i}: chips overflow to {cx}")
        # arrow into the evidence register
        ax1, ax2 = 432, 462
        line(ax1, centers[i], ax2 - 8, centers[i], s["accent"], 2)
        head_right(ax2, centers[i], s["accent"], 6)

    # ------------------------------------------------------ evidence register
    ev_x, ev_w = 452, 248
    box(ev_x, 148, ev_w, 382, 18, s["card"], s["card_edge"], 1.5)
    T(470, 166, "EVIDENCE REGISTER", 11, s["accent"], mono=True, ls="1.1",
      tag="ev_label", max_w=170)
    T(682, 166, "assemble()", 11, s["faint"], mono=True, anchor="end",
      tag="ev_assemble", max_w=90)
    evidence = [
        ("E-chain", "chain.json", "sha256"),
        ("E-timeline", "timeline.jsonl", "sha256"),
        ("E-company-<slug>", "card.json", "sha256"),
    ]
    row_h = 72
    for i, (eid, origin, hash_label) in enumerate(evidence):
        y = 171 + i * 132
        box(464, y, 224, row_h, 12, s["zone"], s["zone_edge"], 1.2,
            shadow=False)
        T(478, y + 24, eid, 13, s["text"], mono=True, weight=700,
          tag=f"ev{i}.id", max_w=200)
        T(478, y + 44, origin, 11, s["sub"], mono=True, tag=f"ev{i}.origin",
          max_w=200)
        check(486, y + 59, s["good"], True, 6)
        T(498, y + 63, hash_label, 11, s["good"], mono=True,
          tag=f"ev{i}.hash", max_w=90)

    # collector spine: the three evidence rows converge into one gate feed
    spine_x = 692
    line(spine_x, 207, spine_x, 471, s["accent"], 2, opacity="0.55")
    for cy in (207, 339, 471):
        add(f'<circle cx="{spine_x}" cy="{cy}" r="3.6" '
            f'fill="{s["accent"]}"/>')
        line(688, cy, spine_x, cy, s["accent"], 2)
    # branch into the gate
    line(spine_x, 253, 728, 253, s["accent"], 2)
    head_right(736, 253, s["accent"], 7)
    T(478, 522, "auto-draft · claims → evidenceIds", 11, s["faint"],
      mono=True, tag="ev_foot", max_w=220)

    # ------------------------------------------------------------ gate card
    gx, gy, gw, gh = 736, 148, 320, 210
    box(gx, gy, gw, gh, 18, s["card"], s["card_edge"], 1.5)
    T(754, 174, "industry_report", 15, s["text"], mono=True, weight=700,
      tag="gate_title", max_w=200)
    T(754, 193, "assemble → contract gate", 11, s["accent"],
      tag="gate_sub", max_w=220)
    gate_checks = [
        "blocks + paragraphs present",
        "value ⇒ sourceRef · statusAsOf",
        "card metrics source + asOf",
        "placeholders 0 · claims → evidence",
    ]
    for i, text in enumerate(gate_checks):
        y = 214 + i * 22
        check(756, y - 4, s["good"], True, 6)
        T(770, y, text, 11.5, s["sub"], tag=f"gate_check{i}", max_w=280)
    T(754, 304, "deterministic adversarial check", 11, s["sub"],
      tag="gate_adv", max_w=270)
    T(754, 326, "red review + bull/bear notes", 11, s["sub"],
      tag="gate_jobs", max_w=200)
    jw = svg_width("ctx.jobs?", 11, True) + 14
    chip(1038 - jw, 314, "ctx.jobs?", 11, s["accent"], s["accent_soft"],
         dash="4 3", h=19)
    T(754, 348, "fail loud · never ship a half report", 11, s["warn"],
      tag="gate_warn", max_w=280)

    # ---------------------------------------------------------------- outlets
    box(736, 376, 158, 134, 16, s["card"], s["accent"], 1.8,
        shadow=True)
    box(898, 376, 158, 134, 16, s["card"], s["zone_edge"], 1.5)
    T(754, 394, "SEALED", 11, s["good"], mono=True, ls="1.1",
      tag="sealed_head", max_w=100)
    T(754, 414, "researchReport", 13, s["text"], mono=True, weight=700,
      tag="sealed_title", max_w=124)
    for i, text in enumerate(["ctx.researchReport", "assemble(evidence,",
                              "sections, claims)", "sealHash · verdicts"]):
        T(754, 436 + i * 18, text, 11, s["sub"], mono=True,
          tag=f"sealed_line{i}", max_w=124)
    T(916, 394, "FALLBACK", 11, s["warn"], mono=True, ls="1.1",
      tag="fallback_head", max_w=120)
    T(916, 414, "builtin-fallback", 13, s["text"], mono=True, weight=700,
      tag="fallback_title", max_w=124)
    for i, text in enumerate(["reports/<ts>/", "report.md",
                              "manifest.json", "claims unverified"]):
        T(916, 436 + i * 18, text, 11, s["sub"], mono=True,
          tag=f"fallback_line{i}", max_w=124)

    # gate split into the two outlets
    path("M896 358 V366 H815 V369", s["accent"], 2)
    head_down(815, 376, s["accent"], 6)
    path("M896 358 V366 H977 V369", s["accent"], 2)
    head_down(977, 376, s["accent"], 6)

    T(736, 530, "research only · not investment advice", 11, s["faint"],
      tag="outlet_note", max_w=300)

    # ---------------------------------------------------------- ledger tape
    box(44, 544, 1012, 62, 14, s["zone"], s["zone_edge"], 1.5,
        shadow=False)
    add(f'<rect x="44" y="552" width="3.5" height="46" rx="2" '
        f'fill="{s["accent"]}"/>')
    T(62, 570, "versions.jsonl", 13, s["accent"], mono=True, weight=700,
      tag="ledger_title", max_w=150)
    T(62, 590, "artifact version ledger", 11, s["faint"], mono=True,
      tag="ledger_sub", max_w=180)
    ledger = ["map → chain.json", "scan → card.json", "report → report.md"]
    lx = 250
    for label in ledger:
        lw = chip(lx, 554, label, 11, s["sub"], s["card"],
                  dash=None, h=24)
        lx += lw + 8
    T(680, 568, "append: path · sha256 · capturedAt · change", 11,
      s["sub"], tag="ledger_append", max_w=360)
    T(680, 590, "read → verify latest hash → mismatch fails loud", 11,
      s["warn"], tag="ledger_read", max_w=370)
    # -------------------------------------------------------------- footer
    T(44, 632,
      "optional seams (looked up at run time, never injected): ctx.web · "
      "ctx.researchReport · ctx.jobs · offline:true disables the web",
      11, s["faint"], tag="footer", max_w=1012)

    add('</svg>')
    return "\n".join(parts) + "\n"


def main() -> None:
    os.makedirs(OUT, exist_ok=True)
    for lang in ("zh", "en"):
        for skin_name in ("light", "dark"):
            hero(lang, skin_name)
    for skin_name in ("light", "dark"):
        path = os.path.join(
            OUT, f"dsh-industry-research-flow-v5-{skin_name}.svg")
        with open(path, "w", encoding="utf-8", newline="\n") as fh:
            fh.write(flow_svg(skin_name))
        print(f"wrote dsh-industry-research-flow-v5-{skin_name}.svg")
    if WARNINGS:
        print(f"{len(WARNINGS)} warning(s) — inspect before shipping.")
    else:
        print("layout checks: no overflow warnings.")


if __name__ == "__main__":
    main()
