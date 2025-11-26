import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onCategory, categoryData, categoryError } from "../redux/auth/actions";

const CATEGORY_STORAGE_KEY = "CATEGORY_DATA";
const API_CALL_COOLDOWN = 2000; // 2 seconds cooldown between API calls

interface CategoryItem {
  id: string;
  title: string;
  icon?: string;
  // Add other category properties as needed
}

interface CategoryResponse {
  status: boolean | string | number;
  data?: CategoryItem[];
  message?: string;
}

// Global flags to prevent duplicate simultaneous API calls
let isApiCallInProgress = false;
let lastApiCallTime = 0;

export const useCategory = () => {
  const dispatch = useDispatch();
  const category = useSelector((state: any) => state.auth.category);
  const categoryErr = useSelector((state: any) => state.auth.categoryErr);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasCalledRef = useRef(false); // Track if API was called in this hook instance

  // Priority: Redux state > Storage
  // Always sync from Redux first, then fallback to storage
  useEffect(() => {
    if (
      category?.status === true ||
      category?.status === "true" ||
      category?.status === 1 ||
      category?.status === "1"
    ) {
      if (category?.data && Array.isArray(category.data) && category.data.length > 0) {
        // Redux has fresh data - update immediately in ALL hook instances
        setCategories(category.data);
        // Save to storage for persistence
        saveCategoriesToStorage(category.data);
        setError(null);
        setIsLoading(false);
        isApiCallInProgress = false;
        // Don't clear Redux state - keep it so all instances can access fresh data
        // Only clear when new data arrives or explicitly refreshed
      }
    } else if (category?.data && Array.isArray(category.data) && category.data.length > 0) {
      // Handle cases where status might be missing but data exists
      setCategories(category.data);
      saveCategoriesToStorage(category.data);
      setError(null);
      setIsLoading(false);
      isApiCallInProgress = false;
    }

    if (categoryErr) {
      setError(categoryErr?.message?.toString() || "Failed to load categories");
      setIsLoading(false);
      isApiCallInProgress = false;
      dispatch(categoryError(""));
    }
  }, [category, categoryErr, dispatch]);

  // Load from storage on mount for instant display (Redux will override when API responds)
  useEffect(() => {
    loadCategoriesFromStorage();
  }, []);

  const loadCategoriesFromStorage = async () => {
    try {
      const storedCategories = await AsyncStorage.getItem(CATEGORY_STORAGE_KEY);
      if (storedCategories) {
        const parsedCategories = JSON.parse(storedCategories);
        setCategories(parsedCategories);
      }
    } catch (error) {
    }
  };

  const saveCategoriesToStorage = async (categoryData: CategoryItem[]) => {
    try {
      await AsyncStorage.setItem(
        CATEGORY_STORAGE_KEY,
        JSON.stringify(categoryData)
      );
    } catch (error) {
    }
  };

  const fetchCategories = useCallback(async () => {
    const now = Date.now();
    
    // If API call is already in progress, don't call again
    if (isApiCallInProgress) {
      return;
    }

    // Prevent too frequent API calls (cooldown period)
    if (now - lastApiCallTime < API_CALL_COOLDOWN && lastApiCallTime > 0) {
      return;
    }

    // Mark API call
    isApiCallInProgress = true;
    lastApiCallTime = now;
    hasCalledRef.current = true;
    
    setIsLoading(true);
    setError(null);
    dispatch(onCategory({ page: 1, limit: 100 }));
  }, [dispatch]);

  const refreshCategories = useCallback(async () => {
    // Force refresh - reset flags and call API
    isApiCallInProgress = false;
    lastApiCallTime = 0;
    // Clear current Redux state to allow fresh fetch
    dispatch(categoryData(""));
    
    setIsLoading(true);
    setError(null);
    dispatch(onCategory({ page: 1, limit: 100 }));
    isApiCallInProgress = true;
    lastApiCallTime = Date.now();
  }, [dispatch]);

  const clearCategories = async () => {
    try {
      await AsyncStorage.removeItem(CATEGORY_STORAGE_KEY);
      setCategories([]);
    } catch (error) {
    }
  };

  return {
    categories,
    isLoading,
    error,
    fetchCategories,
    refreshCategories,
    clearCategories,
  };
};

