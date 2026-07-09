export function getLoadingPercent(itemsLoaded, itemsTotal) {
  if (!Number.isFinite(itemsLoaded) || !Number.isFinite(itemsTotal) || itemsTotal <= 0) {
    return 0;
  }

  const percent = Math.round((itemsLoaded / itemsTotal) * 100);
  return Math.min(100, Math.max(0, percent));
}

export function getLoadingStatus(percent, hasError = false) {
  if (hasError) {
    return "Some assets failed to load";
  }

  if (percent >= 100) {
    return "Gallery ready";
  }

  return "Loading gallery assets";
}
