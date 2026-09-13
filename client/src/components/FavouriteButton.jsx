import React from 'react';
import { Heart } from 'lucide-react';
import { useFavourites } from '../context/FavouritesContext';

export default function FavouriteButton({ property, className = '' }) {
  const { isSaved, toggleFavourite } = useFavourites();
  const id = property?.listing_id || property?.listingId;
  const saved = isSaved(id);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavourite(property);
  };

  return (
    <button
      onClick={handleClick}
      aria-label={saved ? 'Remove from saved' : 'Save property'}
      title={saved ? 'Saved' : 'Save Property'}
      className={`p-2 rounded-full transition-all duration-200 backdrop-blur-md shadow-sm ${
        saved
          ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 hover:scale-110'
          : 'bg-white/90 text-slate-400 hover:text-rose-500 hover:bg-white hover:scale-110'
      } ${className}`}
    >
      <Heart className={`w-4 h-4 transition-colors ${saved ? 'fill-rose-500 text-rose-500' : ''}`} />
    </button>
  );
}
