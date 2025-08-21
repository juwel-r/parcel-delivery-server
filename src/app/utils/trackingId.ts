export const trackingId = () => {
  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const formattedDate = `${yyyy}${mm}${dd}`;

  const trackingId = `TRK-${formattedDate}-${Math.floor(
    Math.random() * 1000000
  )}`;

  return trackingId;
};
