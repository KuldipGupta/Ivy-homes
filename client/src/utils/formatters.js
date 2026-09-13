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

export function formatRent(amount) {
  if (!amount || isNaN(amount)) return '₹0/mo';
  return `₹${Number(amount).toLocaleString('en-IN')}/mo`;
}

export function formatSqft(area) {
  if (!area) return '0 sq.ft';
  // If reported < 50, it is recorded in square meters
  if (area < 50) {
    const inSqft = Math.round(area * 10.7639);
    return `${inSqft} sq.ft (${area} m²)`;
  }
  return `${Number(area).toLocaleString('en-IN')} sq.ft`;
}

export function formatDate(dateString) {
  if (!dateString) return 'N/A';
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (e) {
    return String(dateString);
  }
}

export function capitalize(str) {
  if (!str) return '';
  return str
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}
