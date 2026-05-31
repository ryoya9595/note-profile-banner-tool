const fields = {
  accountName: document.querySelector("#accountName"),
  titleText: document.querySelector("#titleText"),
  targetText: document.querySelector("#targetText"),
  proofText: document.querySelector("#proofText"),
  valueText: document.querySelector("#valueText"),
  motifText: document.querySelector("#motifText"),
  mood: document.querySelector("#mood"),
  palette: document.querySelector("#palette"),
};

const preview = {
  name: document.querySelector("#previewName"),
  title: document.querySelector("#previewTitle"),
  target: document.querySelector("#previewTarget"),
  proof: document.querySelector("#previewProof"),
  value: document.querySelector("#previewValue"),
  motif: document.querySelector("#previewMotif"),
  prompt: document.querySelector("#promptOutput"),
  stage: document.querySelector("#bannerStage"),
  toast: document.querySelector("#toast"),
};

const ideas = [
  {
    accountName: "AI集客ラボ",
    titleText: "AI活用とWeb集客の実践サポート",
    targetText: "個人事業主・ひとり社長",
    proofText: "AI導入 / SNS設計 / 業務効率化",
    valueText: "AIで売上につながる発信をラクにする",
    motifText: "PC、光のライン、未来感",
    mood: "cyber",
    palette: "blueprint",
  },
  {
    accountName: "ひとり社長の設計室",
    titleText: "小さな会社の仕組み化パートナー",
    targetText: "現場で忙しい経営者",
    proofText: "業務整理 / 導線改善 / AI秘書化",
    valueText: "忙しさを減らして、売上に集中できる状態へ",
    motifText: "設計図、デスク、細い罫線",
    mood: "editorial",
    palette: "ink",
  },
  {
    accountName: "発信アトリエ",
    titleText: "SNSとnoteの世界観づくり",
    targetText: "自分らしく売りたい人",
    proofText: "投稿設計 / ブランド言語化 / 導線作成",
    valueText: "言葉とデザインで選ばれる発信へ",
    motifText: "紙、光、余白、手書きの線",
    mood: "luxury",
    palette: "sunset",
  },
  {
    accountName: "Local Growth Desk",
    titleText: "地域ビジネスのAIマーケ支援",
    targetText: "店舗・教室・士業",
    proofText: "MEO / LINE / ショート動画",
    valueText: "近くのお客さんに自然と見つかる導線を作る",
    motifText: "街の光、地図、やわらかい緑",
    mood: "pop",
    palette: "forest",
  },
];

function textValue(id) {
  return fields[id].value.trim();
}

function fitText(element, max, min) {
  element.style.fontSize = `${max}px`;
  let size = max;
  while (element.scrollWidth > element.clientWidth && size > min) {
    size -= 2;
    element.style.fontSize = `${size}px`;
  }
}

function makePrompt() {
  return [
    "noteのクリエイターページ用プロフィールヘッダー画像を作成してください。",
    "サイズは1280×670px、アスペクト比1.91:1。重要な文字・顔・ロゴは中央の表示域に収め、上下左右の端には重要情報を置かないでください。",
    `アカウント名: ${textValue("accountName")}`,
    `肩書き: ${textValue("titleText")}`,
    `ターゲット: ${textValue("targetText")}`,
    `強み・実績: ${textValue("proofText")}`,
    `一番伝えたい価値: ${textValue("valueText")}`,
    `人物・モチーフ: ${textValue("motifText")}`,
    `雰囲気: ${fields.mood.options[fields.mood.selectedIndex].text}`,
    `配色: ${fields.palette.options[fields.palette.selectedIndex].text}`,
    "デザインは余白を活かした上質なWebメディア風。文字は読みやすく、中央にまとまり、noteのプロフィール画面で見切れにくい構図にしてください。",
  ].join("\n");
}

function update() {
  document.body.dataset.mood = fields.mood.value;
  document.body.dataset.palette = fields.palette.value;
  preview.name.textContent = textValue("accountName") || "アカウント名";
  preview.title.textContent = textValue("titleText") || "肩書き";
  preview.target.textContent = `${textValue("targetText") || "ターゲット"}へ`;
  preview.proof.textContent = textValue("proofText") || "強み・実績";
  preview.value.textContent = textValue("valueText") || "一番伝えたい価値";
  preview.motif.textContent = textValue("motifText") || "人物・モチーフ";
  preview.prompt.value = makePrompt();
  requestAnimationFrame(() => fitText(preview.name, 86, 42));
}

function showToast(message) {
  preview.toast.textContent = message;
  preview.toast.classList.add("show");
  window.setTimeout(() => preview.toast.classList.remove("show"), 1600);
}

async function copyPrompt() {
  try {
    await navigator.clipboard.writeText(preview.prompt.value);
    showToast("プロンプトをコピーしたよ");
  } catch {
    preview.prompt.focus();
    preview.prompt.select();
    document.execCommand("copy");
    showToast("プロンプト欄を選択したよ");
  }
}

function randomize() {
  const item = ideas[Math.floor(Math.random() * ideas.length)];
  Object.entries(item).forEach(([key, value]) => {
    fields[key].value = value;
  });
  update();
  showToast("ランダム案を反映したよ");
}

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function svgTemplate() {
  const moodLabel = fields.mood.options[fields.mood.selectedIndex].text;
  const paletteLabel = fields.palette.options[fields.palette.selectedIndex].text;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="670" viewBox="0 0 1280 670">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#101217"/>
      <stop offset="46%" stop-color="#171717"/>
      <stop offset="47%" stop-color="#f7f0df"/>
      <stop offset="100%" stop-color="#fffdf8"/>
    </linearGradient>
    <pattern id="grid" width="42" height="42" patternUnits="userSpaceOnUse">
      <path d="M42 0H0v42" fill="none" stroke="#ffffff" stroke-opacity=".08"/>
    </pattern>
  </defs>
  <rect width="1280" height="670" fill="url(#bg)"/>
  <rect width="1280" height="670" fill="url(#grid)" opacity=".8"/>
  <rect x="70" y="58" width="1140" height="554" fill="none" stroke="#ffffff" stroke-opacity=".18"/>
  <rect x="0" y="108" width="1280" height="454" fill="#1967ff" opacity=".055"/>
  <line x1="0" y1="108" x2="1280" y2="108" stroke="#ffffff" stroke-opacity=".55" stroke-dasharray="12 10" stroke-width="2"/>
  <line x1="0" y1="562" x2="1280" y2="562" stroke="#171717" stroke-opacity=".34" stroke-dasharray="12 10" stroke-width="2"/>
  <rect x="780" y="105" width="310" height="250" fill="none" stroke="#1967ff" stroke-width="2" opacity=".7" transform="rotate(-18 935 230)"/>
  <rect x="845" y="370" width="260" height="180" fill="none" stroke="#d53d2f" stroke-width="2" opacity=".6" transform="rotate(-18 975 460)"/>
  <text x="76" y="205" fill="#fffdf8" font-size="26" font-weight="700">${escapeXml(textValue("targetText"))}へ</text>
  <text x="76" y="300" fill="#fffdf8" font-family="Georgia, serif" font-size="82" font-weight="600">${escapeXml(textValue("accountName"))}</text>
  <text x="80" y="356" fill="#fffdf8" font-size="31" font-weight="800">${escapeXml(textValue("titleText"))}</text>
  <text x="80" y="426" fill="#1967ff" font-size="38" font-weight="900">${escapeXml(textValue("valueText"))}</text>
  <text x="82" y="474" fill="#fffdf8" opacity=".75" font-size="21" font-weight="700">${escapeXml(textValue("proofText"))}</text>
  <rect x="865" y="500" width="345" height="74" rx="8" fill="#fffdf8" opacity=".82"/>
  <circle cx="908" cy="537" r="23" fill="#171717"/>
  <path d="M895 550 L921 524" stroke="#1967ff" stroke-width="5"/>
  <text x="945" y="532" fill="#171717" font-size="18" font-weight="800">${escapeXml(textValue("motifText"))}</text>
  <text x="80" y="616" fill="#fffdf8" opacity=".38" font-size="15">${escapeXml(moodLabel)} / ${escapeXml(paletteLabel)} / note header safe layout</text>
</svg>`;
}

function downloadSvg() {
  const blob = new Blob([svgTemplate()], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `note-banner-${Date.now()}.svg`;
  link.click();
  URL.revokeObjectURL(url);
  showToast("SVGを保存したよ");
}

document.querySelectorAll("input, textarea, select").forEach((el) => {
  el.addEventListener("input", update);
});

document.querySelector("#copyPrompt").addEventListener("click", copyPrompt);
document.querySelector("#randomize").addEventListener("click", randomize);
document.querySelector("#downloadSvg").addEventListener("click", downloadSvg);

document.querySelectorAll(".view-toggle button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".view-toggle button").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    preview.stage.classList.toggle("crop", button.dataset.view === "crop");
  });
});

update();
