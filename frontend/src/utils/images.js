/**
 * Returns the appropriate image path based on the package category.
 * Falls back to a default adventure image.
 */
export const getPackageImage = (kategori = '') => {
  const k = kategori.toLowerCase();
  if (k.includes('pantai') || k.includes('laut') || k.includes('bahari')) return '/images/beach.png';
  if (k.includes('gunung') || k.includes('highland') || k.includes('pegunungan')) return '/images/mountain.png';
  if (k.includes('budaya') || k.includes('sejarah') || k.includes('heritage') || k.includes('kultur')) return '/images/culture.png';
  return '/images/adventure.png';
};
