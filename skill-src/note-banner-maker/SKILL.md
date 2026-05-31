---
name: note-banner-maker
description: Create polished note.com creator profile header banners as final PNG images. Use when the user asks to make, generate, resize, fix, or prepare a note profile/header/banner image, especially when they mention note, creator page, profile banner, 1280x670, central 216px safe area, cropped text, or avoiding cut-off text.
---

# note Banner Maker

Create a ready-to-upload note profile header image.

## Required Output

Always output the final usable image, not a guide image.

- Final size: `1280 x 670 px`
- Important visible safe band: center `1280 x 216 px`
- Top/bottom margins: `227 px` each
- Important text, face, logo, microphone, and other key subject areas must stay inside the center 216px band.
- Do not put guide lines, red boxes, labels, or explanations into the final PNG.

## Workflow

1. As soon as this skill is triggered, start the conversation yourself. Do not wait for the user to describe the banner. First, greet them briefly and ask the hearing questions in the section below. Skip the hearing only if the user already gave full details, or said `おまかせ` / `ランダム` / `わからない`.
2. Right after the hearing answers come back, confirm the number of images by asking `何枚作りますか？（1枚 / 複数枚 / 枚数指定）`. Then apply:
   - If the user says `1枚`, create 1 image.
   - If the user says `複数枚` without a count, create 3 images.
   - If the user specifies a count such as `2枚`, `4枚`, or `5枚`, create that many images.
   - Avoid creating 10 images unless the user explicitly asks for 10.
   - If the user says `おまかせ` for the count too, default to 1 image.
3. If the user specifies a taste/style, use it. If not, choose tasteful variations automatically.
4. Generate or use text-free background images:
   - Choose background subjects that match the user's actual field and theme. Do NOT reuse motifs from the samples. In particular, do not add a microphone, headphones, or music gear unless the user's theme is clearly about voice / music / audio. For AI, marketing, consulting, business, etc., prefer subjects like a clean desk/workspace, abstract tech or data motifs, soft light, plants, or calm gradients.
   - Use image generation for the background, optional person, light, mood, and decorative elements — but only ones that fit the user's theme.
   - Do not ask the image model to render Japanese text.
   - Keep the LEFT side bright, clean, and open for text. Do not place dark, busy, or important subjects behind where the text panel will sit (panel spans roughly the left 55% of the banner). The text sits on a light panel, so a bright left area makes it readable.
5. Run `scripts/compose_note_banner.py` to create final `1280x670` PNG files with text placed inside the center `1280x216` safe band.
6. Verify every final image dimension before reporting completion.

## Hearing Flow

When information is missing, ask this in Japanese:

```text
もちろん。
全部答えなくても大丈夫です。わかる範囲でOKです。

1. アカウント名・肩書きは何ですか？
2. 誰に向けたアカウントですか？
3. バナーに入れたい実績・強みはありますか？
4. 読者に伝えたい一番の価値は何ですか？
5. 好きな雰囲気や色味はありますか？
6. 人物やモチーフは入れたいですか？
7. 参考画像や現在のバナーがあれば添付してください。

そのままコピペで、こんな感じで返してもらえれば大丈夫です。

・アカウント名：
・肩書き：
・ターゲット：
・実績・強み：
・一番伝えたい価値：
・雰囲気・色味：
・人物・モチーフ：
・参考画像：
```

If the user says `おまかせ`, `ランダム`, or `わからない`, proceed with reasonable defaults.

## Background Generation Prompt Pattern

Use this pattern when generating a background:

```text
Create a premium, text-free note.com creator page header background. Wide banner composition, aspect ratio 1.91:1. Do not include any text, letters, logo, or watermark.

Theme: {theme}
Atmosphere: {mood}
Right side: {subject or motif that fits the user's field}, vertically centered in the middle horizontal safe band. Pick a subject that matches the user's actual business or topic — do NOT reuse motifs from other examples (for instance, do not add a microphone unless the theme is about voice or music).
Left side: keep this area bright, clean, and open, with plenty of soft, uncluttered space. A light panel with Japanese text will be placed here, so avoid any dark wash, busy detail, or important subject in the left area.
Top and bottom margins: calm, abstract background with no important subject (they get cropped on note).
Overall look: bright, airy, high-end, and polished. Avoid a heavy dark gradient over the left text area.
```

## Compose Command

After obtaining a background image, run:

```bash
python3 scripts/compose_note_banner.py \
  --background /absolute/path/to/background.png \
  --output /absolute/path/to/final.png \
  --title "高音発声ラボ" \
  --subtitle "高音発声に特化したボイトレ発信" \
  --tagline "無理なく伸びる、響くハイトーンへ。"
```

Optional:

```bash
  --accent blue
  --panel-opacity 176
```

## Text Guidance

Keep text short. A note header has very little vertical room.

Good:
- `高音発声ラボ`
- `高音発声に特化したボイトレ発信`
- `無理なく伸びる、響くハイトーンへ。`

Avoid:
- long explanations
- more than three text lines
- dense bullet points
- AI-rendered Japanese text inside the generated background

## Verification

Before final response:

```bash
sips -g pixelWidth -g pixelHeight /absolute/path/to/final.png
```

Only deliver the final PNG path unless the user asks for implementation details.
