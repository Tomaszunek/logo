const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "[::1]" ||
  /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/u.test(
    window.location.hostname,
  );

const removeRegistrations = async (): Promise<void> => {
  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(
    registrations.map(async (registration) => registration.unregister()),
  );
};

const clearStaleServiceWorkers = () => {
  // This Vite app does not ship a service worker. Remove registrations left
  // By the former Create React App setup so localhost serves current content.
  if (isLocalhost && "serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      removeRegistrations().catch(() => undefined);
    });
  }
};

export const unregister = () => {
  if ("serviceWorker" in navigator) {
    removeRegistrations().catch(() => undefined);
  }
};

export default clearStaleServiceWorkers;
