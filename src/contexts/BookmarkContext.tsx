import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface BookmarkContextType {
  bookmarks: Set<string>;
  isBookmarked: (clubId: string) => boolean;
  toggleBookmark: (clubId: string) => Promise<boolean>;
  getAllBookmarkedClubs: () => string[];
  clearAllBookmarks: () => Promise<void>;
  addBookmark: (clubId: string) => Promise<void>;
  removeBookmark: (clubId: string) => Promise<void>;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

interface BookmarkProviderProps {
  children: ReactNode;
}

const BOOKMARKS_STORAGE_KEY = 'user_bookmarks';

export const BookmarkProvider: React.FC<BookmarkProviderProps> = ({ children }) => {
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());

  // Load bookmarks from storage on mount
  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    try {
      const storedBookmarks = await AsyncStorage.getItem(BOOKMARKS_STORAGE_KEY);
      if (storedBookmarks) {
        const bookmarkArray = JSON.parse(storedBookmarks);
        setBookmarks(new Set(bookmarkArray));
      }
    } catch (error) {
    }
  };

  const saveBookmarks = async (newBookmarks: Set<string>) => {
    try {
      const bookmarkArray = Array.from(newBookmarks);
      await AsyncStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarkArray));
    } catch (error) {
    }
  };

  const isBookmarked = (clubId: string): boolean => {
    return bookmarks.has(clubId);
  };

  const toggleBookmark = async (clubId: string): Promise<boolean> => {
    const newBookmarks = new Set(bookmarks);
    if (newBookmarks.has(clubId)) {
      newBookmarks.delete(clubId);
    } else {
      newBookmarks.add(clubId);
    }
    setBookmarks(newBookmarks);
    await saveBookmarks(newBookmarks);
    return newBookmarks.has(clubId);
  };

  const addBookmark = async (clubId: string): Promise<void> => {
    if (!bookmarks.has(clubId)) {
      const newBookmarks = new Set(bookmarks);
      newBookmarks.add(clubId);
      setBookmarks(newBookmarks);
      await saveBookmarks(newBookmarks);
    }
  };

  const removeBookmark = async (clubId: string): Promise<void> => {
    if (bookmarks.has(clubId)) {
      const newBookmarks = new Set(bookmarks);
      newBookmarks.delete(clubId);
      setBookmarks(newBookmarks);
      await saveBookmarks(newBookmarks);
    }
  };

  const getAllBookmarkedClubs = (): string[] => {
    return Array.from(bookmarks);
  };

  const clearAllBookmarks = async (): Promise<void> => {
    setBookmarks(new Set());
    await saveBookmarks(new Set());
  };

  const value: BookmarkContextType = {
    bookmarks,
    isBookmarked,
    toggleBookmark,
    getAllBookmarkedClubs,
    clearAllBookmarks,
    addBookmark,
    removeBookmark,
  };

  return (
    <BookmarkContext.Provider value={value}>
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmark = (): BookmarkContextType => {
  const context = useContext(BookmarkContext);
  if (context === undefined) {
    throw new Error('useBookmark must be used within a BookmarkProvider');
  }
  return context;
};
