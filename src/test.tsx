/**
 * AWS S3 Upload Test and Reference Implementation
 * 
 * This file demonstrates how to implement AWS S3 file uploads in your React Native app.
 * Reference this implementation when implementing S3 uploads in other components.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import { AWSOptions } from './utilis/appConstant';

/**
 * Upload file to AWS S3
 * @param filePath - Local file path to upload
 * @param fileName - Name to save file as in S3
 * @param contentType - MIME type of the file (e.g., 'image/jpeg', 'image/png')
 * @returns Promise with upload result
 */
const uploadToS3 = async (
  filePath: string,
  fileName: string,
  contentType: string
): Promise<string> => {
  try {
    console.log('Starting S3 upload...');
    console.log('File path:', filePath);
    console.log('File name:', fileName);
    console.log('Content type:', contentType);

    // Read file content
    const fileContent = await RNFS.readFile(filePath, 'base64');

    // Prepare S3 upload parameters
    const url = `https://${AWSOptions.bucket}.s3.${AWSOptions.region}.amazonaws.com/${fileName}`;
    
    const headers = {
      'Content-Type': contentType,
    };

    // Generate AWS signature for upload (simplified - in production use AWS SDK)
    // For production, implement proper AWS signature v4 signing
    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: fileContent,
    });

    if (response.ok || response.status === 200) {
      const publicUrl = `https://${AWSOptions.bucket}.s3.${AWSOptions.region}.amazonaws.com/${fileName}`;
      console.log('Upload successful:', publicUrl);
      return publicUrl;
    } else {
      throw new Error(`Upload failed: ${response.statusText}`);
    }
  } catch (error) {
    console.error('S3 upload error:', error);
    throw error;
  }
};

/**
 * Test Component for AWS S3 Upload
 * Demonstrates image selection and upload to S3
 */
const AWSUploadTest: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Select image from device gallery
   */
  const selectImage = () => {
    const options = {
      mediaType: 'photo' as const,
      quality: 0.8 as const,
      maxWidth: 2048,
      maxHeight: 2048,
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
        Alert.alert('Error', 'Failed to select image');
      } else if (response.assets && response.assets[0]) {
        const uri = response.assets[0].uri;
        if (uri) {
          setSelectedImage(uri);
          setUploadUrl(null);
          setError(null);
        }
      }
    });
  };

  /**
   * Upload selected image to AWS S3
   */
  const uploadImageToS3 = async () => {
    if (!selectedImage) {
      Alert.alert('No Image', 'Please select an image first');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Generate unique file name
      const timestamp = Date.now();
      const fileName = `uploads/test-image-${timestamp}.jpg`;
      
      // Determine content type based on file extension
      const contentType = 'image/jpeg';

      console.log('Uploading to S3:', fileName);
      
      // Upload file
      const url = await uploadToS3(selectedImage, fileName, contentType);
      
      setUploadUrl(url);
      Alert.alert('Success', 'Image uploaded successfully!');
    } catch (err: any) {
      const errorMessage = err.message || 'Upload failed';
      setError(errorMessage);
      Alert.alert('Upload Failed', errorMessage);
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  /**
   * Clear all state
   */
  const clearAll = () => {
    setSelectedImage(null);
    setUploadUrl(null);
    setError(null);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>AWS S3 Upload Test</Text>

      {/* AWS Configuration Info */}
      <View style={styles.configContainer}>
        <Text style={styles.sectionTitle}>AWS Configuration:</Text>
        <Text style={styles.configText}>Bucket: {AWSOptions.bucket}</Text>
        <Text style={styles.configText}>Region: {AWSOptions.region}</Text>
      </View>

      {/* Selected Image Preview */}
      {selectedImage && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: selectedImage }} style={styles.previewImage} />
          <Text style={styles.imageInfo}>Selected Image</Text>
        </View>
      )}

      {/* Upload URL Display */}
      {uploadUrl && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Upload Successful!</Text>
          <Text style={styles.resultUrl} numberOfLines={2}>
            {uploadUrl}
          </Text>
        </View>
      )}

      {/* Error Display */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Upload Loading Indicator */}
      {uploading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Uploading to S3...</Text>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.selectButton]}
          onPress={selectImage}
          disabled={uploading}
        >
          <Text style={styles.buttonText}>Select Image</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            styles.uploadButton,
            (!selectedImage || uploading) && styles.buttonDisabled,
          ]}
          onPress={uploadImageToS3}
          disabled={!selectedImage || uploading}
        >
          <Text style={styles.buttonText}>
            {uploading ? 'Uploading...' : 'Upload to S3'}
          </Text>
        </TouchableOpacity>

        {(selectedImage || uploadUrl) && (
          <TouchableOpacity
            style={[styles.button, styles.clearButton]}
            onPress={clearAll}
            disabled={uploading}
          >
            <Text style={styles.buttonText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Usage Instructions */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsTitle}>How to Use in Your Code:</Text>
        <Text style={styles.instructionsText}>
          1. Import: import {`{ uploadToS3 }`} from './test';
        </Text>
        <Text style={styles.instructionsText}>
          2. Select file from gallery or camera
        </Text>
        <Text style={styles.instructionsText}>
          3. Call: const url = await uploadToS3(filePath, fileName, contentType);
        </Text>
        <Text style={styles.instructionsText}>
          4. Use the returned URL in your app
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  configContainer: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  configText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  imageContainer: {
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  imageInfo: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  resultContainer: {
    width: '100%',
    backgroundColor: '#d4edda',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#155724',
  },
  resultUrl: {
    fontSize: 12,
    color: '#155724',
  },
  errorContainer: {
    width: '100%',
    backgroundColor: '#f8d7da',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    fontSize: 14,
    color: '#721c24',
  },
  loadingContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#007AFF',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 20,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  selectButton: {
    backgroundColor: '#007AFF',
  },
  uploadButton: {
    backgroundColor: '#28a745',
  },
  clearButton: {
    backgroundColor: '#6c757d',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  instructionsContainer: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  instructionsText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
});

export { uploadToS3, AWSUploadTest };
export default AWSUploadTest;

