const copyText = document.querySelector("#copyText");
const copyBtn = document.querySelector("#copyPrompt");
const toast = document.querySelector("#toast");

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1600);
}

copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(copyText.value);
    showToast("指示文をコピーしました");
  } catch {
    copyText.focus();
    copyText.select();
    document.execCommand("copy");
    showToast("指示文を選択しました");
  }
});
