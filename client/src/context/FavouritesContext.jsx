import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as favouriteService from '../services/favouriteService';
import { useAuth } from './AuthContext';

const FavouritesContext = createContext(null);

export function FavouritesProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [favourites, setFavourites] = useState([]);
  const [savedIds, setSavedIds] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);

  const fetchFavourites = useCallback(async () => {
    if (!isAuthenticated) {
      setFavourites([]);
      setSavedIds(new Set());
      return;
    }

    setIsLoading(true);
    try {
      const res = await favouriteService.getFavourites();
      const items = res.data || [];
      setFavourites(items);
      setSavedIds(new Set(items.map(f => f.listing_id || f.listingId)));
    } catch (e) {
      console.warn('[Favourites] Failed to fetch favourites:', e.message);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchFavourites();
  }, [fetchFavourites]);

  const isSaved = useCallback((id) => {
    return savedIds.has(id);
  }, [savedIds]);

  const toggleFavourite = async (property) => {
    const id = property.listing_id || property.listingId;
    if (!id) return;

    const alreadySaved = savedIds.has(id);

    // Optimistic UI update
    setSavedIds(prev => {
      const next = new Set(prev);
      if (alreadySaved) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });

    if (alreadySaved) {
      setFavourites(prev => prev.filter(f => (f.listing_id || f.listingId) !== id));
    } else {
      setFavourites(prev => [property, ...prev]);
    }

    // Server update
    try {
      if (alreadySaved) {
        await favouriteService.removeFavourite(id);
      } else {
        await favouriteService.addFavourite(id);
      }
    } catch (err) {
      console.error('[Favourites] API sync failed, rolling back UI:', err.message);
      // Rollback
      setSavedIds(prev => {
        const next = new Set(prev);
        if (alreadySaved) {
          next.add(id);
        } else {
          next.delete(id);
        }
        return next;
      });
      fetchFavourites();
    }
  };

  return (
    <FavouritesContext.Provider
      value={{
        favourites,
        savedIds,
        isSaved,
        toggleFavourite,
        refreshFavourites: fetchFavourites,
        isLoading
      }}
    >
      {children}
    </FavouritesContext.Provider>
  );
}

export function useFavourites() {
  const ctx = useContext(FavouritesContext);
  if (!ctx) throw new Error('useFavourites must be used within FavouritesProvider');
  return ctx;
}
