import React, { useEffect } from 'react';
import { useCategory } from '../hooks/useCategory';


interface AppInitializerProps {
  children: React.ReactNode;
}

const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const { fetchCategories } = useCategory();


  useEffect(() => {
    // Initialize app data when component mounts
    const initializeApp = async () => {
      console.log('App Initializer: Starting app initialization...');
      
      // Fetch categories and home data (these will only call API once due to the hook logic)
      await Promise.all([
        fetchCategories(),
      ]);
      
      console.log('App Initializer: App initialization completed');
    };

    initializeApp();
  }, [fetchCategories]);

  return <>{children}</>;
};

export default AppInitializer;
