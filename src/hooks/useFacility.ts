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
      if (facility?.data) {
        console.log('Facility API response received, updating facilities');
        setFacilities(facility.data);
        saveFacilitiesToStorage(facility.data);
        setError(null);
      }
      dispatch(facilityData(''));
      setIsLoading(false);
    }

    if (facilityErr) {
      console.error('Facility API error:', facilityErr);
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

  const checkIfApiCalled = async (): Promise<boolean> => {
    try {
      const apiCalled = await AsyncStorage.getItem(FACILITY_API_CALLED_KEY);
      return apiCalled === 'true';
    } catch (error) {
      return false;
    }
  };

  const markApiAsCalled = async () => {
    try {
      await AsyncStorage.setItem(FACILITY_API_CALLED_KEY, 'true');
    } catch (error) {
    }
  };

  const fetchFacilities = async () => {
    const hasApiBeenCalled = await checkIfApiCalled();
    
    // Only make API call once per session, use cached data otherwise
    if (hasApiBeenCalled) {
      console.log('Facility API already called in this session, using cached data');
      return;
    }

    // If we already have facilities, don't call API again
    if (facilities.length > 0) {
      console.log('Facilities already loaded, skipping API call');
      return;
    }

    console.log('Fetching facilities from API...');
    setIsLoading(true);
    setError(null);
    dispatch(onFacility({ page: 1, limit: 100 }));
    await markApiAsCalled();
  };

  const refreshFacilities = async () => {
    console.log('Refreshing facilities from API...');
    
    // Clear the API called flag to allow fresh fetch
    try {
      await AsyncStorage.removeItem(FACILITY_API_CALLED_KEY);
      console.log('Cleared facility API flag');
    } catch (error) {
      console.error('Error clearing API flag:', error);
    }
    
    setIsLoading(true);
    setError(null);
    dispatch(onFacility({ page: 1, limit: 100 }));
  };

  const clearFacilities = async () => {
    try {
      await AsyncStorage.removeItem(FACILITY_STORAGE_KEY);
      await AsyncStorage.removeItem(FACILITY_API_CALLED_KEY);
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
