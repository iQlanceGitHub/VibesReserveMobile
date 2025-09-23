import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onFacility, facilityData, facilityError } from '../redux/auth/actions';

const FACILITY_STORAGE_KEY = 'FACILITY_DATA';
const FACILITY_API_CALLED_KEY = 'FACILITY_API_CALLED';

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

export const useFacility = () => {
  const dispatch = useDispatch();
  const facility = useSelector((state: any) => state.auth.facility);
  const facilityErr = useSelector((state: any) => state.auth.facilityErr);
  const [facilities, setFacilities] = useState<FacilityItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load facilities from storage on mount
  useEffect(() => {
    loadFacilitiesFromStorage();
  }, []);

  // Handle API response
  useEffect(() => {
    if (facility?.status === true || facility?.status === 'true' || facility?.status === 1 || facility?.status === "1") {
      console.log("Facility API Success:", facility);
      if (facility?.data) {
        setFacilities(facility.data);
        saveFacilitiesToStorage(facility.data);
        setError(null);
      }
      dispatch(facilityData(''));
      setIsLoading(false);
    }

    if (facilityErr) {
      console.log("Facility API Error:", facilityErr);
      setError(facilityErr?.message?.toString() || 'Failed to load facilities');
      dispatch(facilityError(''));
      setIsLoading(false);
    }
  }, [facility, facilityErr, dispatch]);

  const loadFacilitiesFromStorage = async () => {
    try {
      const storedFacilities = await AsyncStorage.getItem(FACILITY_STORAGE_KEY);
      if (storedFacilities) {
        const parsedFacilities = JSON.parse(storedFacilities);
        setFacilities(parsedFacilities);
        console.log("Facilities loaded from storage:", parsedFacilities);
      }
    } catch (error) {
      console.log("Error loading facilities from storage:", error);
    }
  };

  const saveFacilitiesToStorage = async (facilityData: FacilityItem[]) => {
    try {
      await AsyncStorage.setItem(FACILITY_STORAGE_KEY, JSON.stringify(facilityData));
      console.log("Facilities saved to storage");
    } catch (error) {
      console.log("Error saving facilities to storage:", error);
    }
  };

  const checkIfApiCalled = async (): Promise<boolean> => {
    try {
      const apiCalled = await AsyncStorage.getItem(FACILITY_API_CALLED_KEY);
      return apiCalled === 'true';
    } catch (error) {
      console.log("Error checking API call status:", error);
      return false;
    }
  };

  const markApiAsCalled = async () => {
    try {
      await AsyncStorage.setItem(FACILITY_API_CALLED_KEY, 'true');
      console.log("Facility API marked as called");
    } catch (error) {
      console.log("Error marking API as called:", error);
    }
  };

  const fetchFacilities = async () => {
    const hasApiBeenCalled = await checkIfApiCalled();
    
    if (hasApiBeenCalled) {
      console.log("Facility API already called, using stored data");
      return;
    }

    if (facilities.length > 0) {
      console.log("Facilities already loaded from storage");
      return;
    }

    console.log("Calling Facility API...");
    setIsLoading(true);
    setError(null);
    dispatch(onFacility({ page: 1, limit: 100 }));
    await markApiAsCalled();
  };

  const refreshFacilities = () => {
    console.log("Refreshing facilities...");
    setIsLoading(true);
    setError(null);
    dispatch(onFacility({ page: 1, limit: 100 }));
  };

  const clearFacilities = async () => {
    try {
      await AsyncStorage.removeItem(FACILITY_STORAGE_KEY);
      await AsyncStorage.removeItem(FACILITY_API_CALLED_KEY);
      setFacilities([]);
      console.log("Facilities cleared");
    } catch (error) {
      console.log("Error clearing facilities:", error);
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
