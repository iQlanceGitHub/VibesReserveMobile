import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onCategory, categoryData, categoryError } from "../redux/auth/actions";

const CATEGORY_STORAGE_KEY = "CATEGORY_DATA";
const CATEGORY_API_CALLED_KEY = "CATEGORY_API_CALLED";

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

export const useCategory = () => {
  const dispatch = useDispatch();
  const category = useSelector((state: any) => state.auth.category);
  const categoryErr = useSelector((state: any) => state.auth.categoryErr);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load categories from storage on mount
  useEffect(() => {
    loadCategoriesFromStorage();
  }, []);

  // Handle API response
  useEffect(() => {
    if (
      category?.status === true ||
      category?.status === "true" ||
      category?.status === 1 ||
      category?.status === "1"
    ) {
      console.log("Category API Success:", category);
      if (category?.data) {
        setCategories(category.data);
        saveCategoriesToStorage(category.data);
        setError(null);
      }
      dispatch(categoryData(""));
      setIsLoading(false);
    }

    if (categoryErr) {
      console.log("Category API Error:", categoryErr);
      setError(categoryErr?.message?.toString() || "Failed to load categories");
      dispatch(categoryError(""));
      setIsLoading(false);
    }
  }, [category, categoryErr, dispatch]);

  const loadCategoriesFromStorage = async () => {
    try {
      const storedCategories = await AsyncStorage.getItem(CATEGORY_STORAGE_KEY);
      if (storedCategories) {
        const parsedCategories = JSON.parse(storedCategories);
        setCategories(parsedCategories);
        console.log("Categories loaded from storage:", parsedCategories);
      }
    } catch (error) {
      console.log("Error loading categories from storage:", error);
    }
  };

  const saveCategoriesToStorage = async (categoryData: CategoryItem[]) => {
    try {
      await AsyncStorage.setItem(
        CATEGORY_STORAGE_KEY,
        JSON.stringify(categoryData)
      );
      console.log("Categories saved to storage");
    } catch (error) {
      console.log("Error saving categories to storage:", error);
    }
  };

  const checkIfApiCalled = async (): Promise<boolean> => {
    try {
      const apiCalled = await AsyncStorage.getItem(CATEGORY_API_CALLED_KEY);
      return apiCalled === "true";
    } catch (error) {
      console.log("Error checking API call status:", error);
      return false;
    }
  };

  const markApiAsCalled = async () => {
    try {
      await AsyncStorage.setItem(CATEGORY_API_CALLED_KEY, "true");
      console.log("Category API marked as called");
    } catch (error) {
      console.log("Error marking API as called:", error);
    }
  };

  const fetchCategories = async () => {
    const hasApiBeenCalled = await checkIfApiCalled();

    if (hasApiBeenCalled) {
      console.log("Category API already called, using stored data");
      return;
    }

    if (categories.length > 0) {
      console.log("Categories already loaded from storage");
      return;
    }

    console.log("Calling Category API...");
    setIsLoading(true);
    setError(null);
    dispatch(onCategory({ page: 1, limit: 100 }));
    await markApiAsCalled();
  };

  const refreshCategories = () => {
    console.log("Refreshing categories...");
    setIsLoading(true);
    setError(null);
    dispatch(onCategory({ page: 1, limit: 100 }));
  };

  const clearCategories = async () => {
    try {
      await AsyncStorage.removeItem(CATEGORY_STORAGE_KEY);
      await AsyncStorage.removeItem(CATEGEGORY_API_CALLED_KEY);
      setCategories([]);
      console.log("Categories cleared");
    } catch (error) {
      console.log("Error clearing categories:", error);
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
