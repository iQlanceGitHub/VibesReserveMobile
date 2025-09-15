import { Platform } from 'react-native';
import RNFS from 'react-native-fs'; // You'll need to install this package

// Add this function to create a permanent copy of the file
export const reatePermanentFileCopy = async (file: any) => {
  if (Platform.OS !== 'ios') {
    return file; // Only needed for iOS
  }

  try {
    const sourcePath = file.uri;
    const fileName = file.name || `file_${Date.now()}`;
    const destPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

    // Copy file to permanent storage
    await RNFS.copyFile(sourcePath, destPath);

    // Return new file object with permanent path
    return {
      ...file,
      uri: destPath,
      permanentPath: destPath // Keep track of the permanent path
    };
  } catch (error) {
    console.log('Error creating file copy:', error);
    return file; // Fallback to original file
  }
};