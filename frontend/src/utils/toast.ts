export function showToast(
  message: string,
  type: "success" | "error" = "success"
) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `alert alert-${type} shadow-lg`;
  toast.innerHTML = `
      <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}
