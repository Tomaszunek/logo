const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "[::1]" ||
  /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/.test(
    window.location.hostname,
  );

export default function clearStaleServiceWorkers() {
  // This Vite app does not ship a service worker. Remove registrations left
  // by the former Create React App setup so localhost serves current content.
  if (isLocalhost && "serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => registration.unregister());
      });
    });
  }
}

export function unregister() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => registration.unregister());
    });
  }
}
