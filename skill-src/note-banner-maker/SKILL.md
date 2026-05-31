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

1. If the user has not provided enough banner information, ask the hearing questions in the section below before generating.
2. Determine the number of final images:
   - If the user says `1枚`, create 1 image.
   - If the user says `複数枚` without a count, create 3 images.
   - If the user specifies a count such as `2枚`, `4枚`, or `5枚`, create that many images.
   - Avoid creating 10 images unless the user explicitly asks for 10.
3. If the user specifies a taste/style, use it. If not, choose tasteful variations automatically.
4. Generate or use text-free background images:
   - Use image generation for background, person, microphone, light, mood, and decorative elements.
   - Do not ask the image model to render Japanese text.
   - Prompt the image model to leave open space on the left for text.
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
Create a premium text-free note.com creator page header background. Wide banner composition, aspect ratio 1.91:1. Do not include any text, letters, logo, or watermark.

Theme: {theme}
Atmosphere: {mood}
Right side: {subject or motif}, vertically centered in the middle horizontal safe band.
Left side: large clean empty space for adding Japanese text later.
Top and bottom margins should be mostly abstract background with no important subject.
High-end, polished, usable commercial banner background.
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
