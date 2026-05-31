const copyText = document.querySelector("#copyText");
const toast = document.querySelector("#toast");

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1600);
}

function buildPrompt(base) {
  return `noteプロフィール用バナーを作ってください。

依頼：${base}
サイズ：1280×670px
重要な文字・人物・モチーフは中央1280×216pxに収めてください。
ガイド版ではなく、そのままnoteに設定できる完成PNGだけください。

必要であれば、作る前に以下をヒアリングしてください。
・アカウント名：
・肩書き：
・ターゲット：
・実績・強み：
・一番伝えたい価値：
・雰囲気・色味：
・人物・モチーフ：
・参考画像：`;
}

document.querySelectorAll("[data-prompt]").forEach((button) => {
  button.addEventListener("click", () => {
    copyText.value = buildPrompt(button.dataset.prompt);
    copyText.focus();
    copyText.select();
    showToast("依頼文をセットしたよ");
  });
});

document.querySelector("#copyPrompt").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(copyText.value);
    showToast("依頼文をコピーしたよ");
  } catch {
    copyText.focus();
    copyText.select();
    document.execCommand("copy");
    showToast("依頼文を選択したよ");
  }
});
