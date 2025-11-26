import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { colors } from "../../utilis/colors";
import LinearGradient from "react-native-linear-gradient";
import BackArrow from "../../assets/svg/ArrowLeft";
import { getCmsContentData, getCmsContentError } from "../../redux/auth/actions";
import { showToast } from "../../utilis/toastUtils";
import styles from "./styles";

interface CmsContentScreenProps {
  navigation?: any;
  route?: any;
}

const CmsContentScreen: React.FC<CmsContentScreenProps> = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { cmsContent, cmsContentErr, loader } = useSelector((state: any) => state.auth);
  
  const { identifier, title, content } = route?.params || {};
  const [currentContent, setCurrentContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // If content is passed directly via params, use it immediately
  useEffect(() => {
    if (content) {
      console.log('📄 Content received via params:', content);
      setCurrentContent({ content });
      setIsLoading(false);
    }
  }, [content]);

  // Handle Redux state changes
  useEffect(() => {
    if (cmsContent && cmsContent.data) {
      console.log('📄 CMS Content received from Redux:', cmsContent.data);
      setCurrentContent(cmsContent.data);
      setIsLoading(false);
    }
  }, [cmsContent]);

  useEffect(() => {
    if (cmsContentErr) {
      console.log('CMS content error:', cmsContentErr);
      showToast('error', 'Failed to load content. Please try again.');
      setIsLoading(false);
      dispatch(getCmsContentError(''));
    }
  }, [cmsContentErr]);

  useEffect(() => {
    if (loader) {
      setIsLoading(true);
    }
  }, [loader]);

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      console.log('🧹 Component unmounting, clearing content');
      dispatch(getCmsContentData(''));
      dispatch(getCmsContentError(''));
    };
  }, []);

  const handleGoBack = () => {
    console.log('🔙 Going back, clearing content');
    dispatch(getCmsContentData(''));
    dispatch(getCmsContentError(''));
    navigation.goBack();
  };

  const renderContent = () => {
    console.log('🔍 Render Content Debug:', {
      isLoading,
      loader,
      currentContent: !!currentContent,
      cmsContent: !!cmsContent,
      hasDirectContent: !!content,
      identifier,
      title
    });

    if (isLoading || loader) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.white} />
          <Text style={styles.loadingText}>Loading content...</Text>
        </View>
      );
    }

    if (!currentContent) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No content available</Text>
        </View>
      );
    }

    const contentText = currentContent.content || '';
    console.log('📝 Content to display:', contentText.substring(0, 100) + '...');
    
    // Simple HTML to text conversion for display
    const cleanContent = contentText
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'")
      .replace(/&nbsp;/g, ' ');

    console.log('🧹 Clean content:', cleanContent.substring(0, 100) + '...');

    return (
      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {/* <Text style={styles.contentTitle}>{title}</Text> */}
        <Text style={styles.contentText}>{cleanContent}</Text>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.profileCardBackground} />
      
      <LinearGradient
        colors={[colors.gradient_dark_purple, colors.gradient_light_purple]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <BackArrow />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{title || 'Content'}</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Content */}
        {renderContent()}
      </LinearGradient>
    </SafeAreaView>
  );
};

export default CmsContentScreen;
