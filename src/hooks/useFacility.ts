import { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onFacility, facilityData, facilityError } from '../redux/auth/actions';

const FACILITY_STORAGE_KEY = 'FACILITY_DATA';
const FACILITY_API_CALL_COOLDOWN = 2000; // 2 seconds cooldown between API calls

interface FacilityItem {
  id: string;
  title: string;
  icon?: string;
  // Add other facility properties as needed
}

interface FacilityResponse {
  data?: FacilityItem[];
  message?: string;
}

// Global flags to prevent duplicate simultaneous API calls
let isFacilityApiCallInProgress = false;
let lastFacilityApiCallTime = 0;

export const useFacility = () => {
  const dispatch = useDispatch();
  const facility = useSelector((state: any) => state.auth.facility);
  const facilityErr = useSelector((state: any) => state.auth.facilityErr);
  const [facilities, setFacilities] = useState<FacilityItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasCalledRef = useRef(false); // Track if API was called in this hook instance

  // Priority: Redux state > Storage
  // Always sync from Redux first, then fallback to storage
  useEffect(() => {
    if (facility?.status === true || facility?.status === 'true' || facility?.status === 1 || facility?.status === "1") {
      if (facility?.data && Array.isArray(facility.data) && facility.data.length > 0) {
        // Redux has fresh data - update immediately in ALL hook instances
        setFacilities(facility.data);
        // Save to storage for persistence
        saveFacilitiesToStorage(facility.data);
        setError(null);
        setIsLoading(false);
        isFacilityApiCallInProgress = false;
        // Don't clear Redux state - keep it so all instances can access fresh data
        // Only clear when new data arrives or explicitly refreshed
      }
    } else if (facility?.data && Array.isArray(facility.data) && facility.data.length > 0) {
      // Handle cases where status might be missing but data exists
      setFacilities(facility.data);
      saveFacilitiesToStorage(facility.data);
      setError(null);
      setIsLoading(false);
      isFacilityApiCallInProgress = false;
    }

    if (facilityErr) {
      setError(facilityErr?.message?.toString() || 'Failed to load facilities');
      setIsLoading(false);
      isFacilityApiCallInProgress = false;
      dispatch(facilityError(''));
    }
  }, [facility, facilityErr, dispatch]);

  // Load from storage on mount for instant display (Redux will override when API responds)
  useEffect(() => {
    loadFacilitiesFromStorage();
  }, []);

  const loadFacilitiesFromStorage = async () => {
    try {
      const storedFacilities = await AsyncStorage.getItem(FACILITY_STORAGE_KEY);
      if (storedFacilities) {
        const parsedFacilities = JSON.parse(storedFacilities);
        setFacilities(parsedFacilities);
      }
    } catch (error) {
    }
  };

  const saveFacilitiesToStorage = async (facilityData: FacilityItem[]) => {
    try {
      await AsyncStorage.setItem(FACILITY_STORAGE_KEY, JSON.stringify(facilityData));
    } catch (error) {
    }
  };

  const fetchFacilities = useCallback(async () => {
    const now = Date.now();
    
    // If API call is already in progress, don't call again
    if (isFacilityApiCallInProgress) {
      return;
    }

    // Prevent too frequent API calls (cooldown period)
    if (now - lastFacilityApiCallTime < FACILITY_API_CALL_COOLDOWN && lastFacilityApiCallTime > 0) {
      return;
    }

    // Mark API call
    isFacilityApiCallInProgress = true;
    lastFacilityApiCallTime = now;
    hasCalledRef.current = true;
    
    setIsLoading(true);
    setError(null);
    dispatch(onFacility({ page: 1, limit: 100 }));
  }, [dispatch]);

  const refreshFacilities = useCallback(async () => {
    // Force refresh - reset flags and call API
    isFacilityApiCallInProgress = false;
    lastFacilityApiCallTime = 0;
    // Clear current Redux state to allow fresh fetch
    dispatch(facilityData(''));
    
    setIsLoading(true);
    setError(null);
    dispatch(onFacility({ page: 1, limit: 100 }));
    isFacilityApiCallInProgress = true;
    lastFacilityApiCallTime = Date.now();
  }, [dispatch]);

  const clearFacilities = async () => {
    try {
      await AsyncStorage.removeItem(FACILITY_STORAGE_KEY);
      setFacilities([]);
    } catch (error) {
    }
  };

  return {
    facilities,
    isLoading,
    error,
    fetchFacilities,
    refreshFacilities,
    clearFacilities,
  };
};

