declare global {
  interface Window {
    Tawk_API?: {
      toggle: () => void;
      maximize: () => void;
      minimize: () => void;
      hideWidget: () => void;
      showWidget: () => void;
      onLoaded?: () => void;
      onChatMinimized?: () => void;
      onChatHidden?: () => void;
    };
  }
}

export function openLiveChat() {
  if (typeof window !== "undefined" && window.Tawk_API) {
    window.Tawk_API.showWidget();
    window.Tawk_API.maximize();
  }
}

export function closeLiveChat() {
  if (typeof window !== "undefined" && window.Tawk_API) {
    window.Tawk_API.minimize();
    window.Tawk_API.hideWidget();
  }
}

export function setupTawkAutoHide() {
  if (typeof window === "undefined" || !window.Tawk_API) return;

  // Hide the floating bubble until the user explicitly opens chat
  window.Tawk_API.hideWidget();

  // Re-hide it whenever the visitor minimizes the chat window
  window.Tawk_API.onChatMinimized = () => {
    window.Tawk_API?.hideWidget();
  };
}
