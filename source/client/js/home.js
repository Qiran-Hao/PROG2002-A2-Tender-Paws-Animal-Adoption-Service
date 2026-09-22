/* ==========================================================================
   Tender Paws A2-2 — home page: featured services
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const list = $("#featured-list");
  if (!list) return;

  const load = async () => {
    showState(list, "Loading featured services…");
    try {
      const events = await api("/api/events/featured");
      if (!Array.isArray(events) || events.length === 0) {
        showState(
          list,
          "No featured services have been published yet. Use the category tiles above to browse the whole directory."
        );
        return;
      }
      list.innerHTML = events.map(card).join("");
    } catch {
      showState(
        list,
        "Featured services are unavailable right now. The service directory above still works, or you can try loading the featured list again.",
        load
      );
    }
  };

  load();
});
