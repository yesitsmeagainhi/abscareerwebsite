/* ABS Leads service worker — shows push notifications for new leads, even when
   the admin tab is closed. Registered from the admin panel. */

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = {};
  }
  const title = data.title || "🔔 New lead";
  const options = {
    body: data.body || "New website enquiry",
    tag: data.tag || "abs-lead",
    icon: "/favicon.ico",
    badge: "/favicon.ico",
    renotify: true,
    data: { url: data.url || "/admin/leads" },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || "/admin/leads";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if (client.url.includes("/admin") && "focus" in client) return client.focus();
      }
      return self.clients.openWindow(target);
    }),
  );
});
