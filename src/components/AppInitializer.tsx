import React, { useEffect } from 'react';
import { useCategory } from '../hooks/useCategory';
import { useFacility } from '../hooks/useFacility';


interface AppInitializerProps {
  children: React.ReactNode;
}

const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const { fetchCategories } = useCategory();
  const { fetchFacilities } = useFacility();


  useEffect(() => {
    // Initialize app data when component mounts
    const initializeApp = async () => {
      console.log('App Initializer: Starting app initialization...');
      
      // Fetch categories and facilities data (these will only call API once due to the hook logic)
      await Promise.all([
        fetchCategories(),
        fetchFacilities(),
      ]);
      
      console.log('App Initializer: App initialization completed');
    };

    initializeApp();
  }, [fetchCategories, fetchFacilities]);

  return <>{children}</>;
};

export default AppInitializer;
