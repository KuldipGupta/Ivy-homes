export function normalizeProjectPrice(price) {
  if (price === null || price === undefined) return 0;
  // If price >= 10, it is stored in Lakhs
  // If price < 10, it is stored in Crores
  if (price >= 10) {
    return Math.round(price * 100000);
  }
  return Math.round(price * 10000000);
}

export function normalizeArea(carpetArea) {
  if (!carpetArea) return 0;
  // If carpet area < 50 in residential listings, it is recorded in square meters
  if (carpetArea > 0 && carpetArea < 50) {
    return Math.round(carpetArea * 10.7639);
  }
  return carpetArea;
}

export function formatINR(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹0';
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  }
  return `₹${Number(amount).toLocaleString('en-IN')}`;
}
