// import React, { useRef, useEffect, useState } from 'react';
// import { View, Text, StyleSheet, Image, Dimensions, useColorScheme, Platform } from 'react-native';
// import Carousel from 'react-native-snap-carousel';
// import { Buttons } from '../../../components/buttons';
// import { getHeight, getWidth } from '../../../utilis/appConstant';
// import { colors } from "../../../utilis/colors";
// import { fonts } from "../../../utilis/fonts";

// import LinearGradient from 'react-native-linear-gradient';
// import styles from "./styles";
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import Walkthrough from "../../../assets/svg/walkthrough";

// interface IntroScreenProps {
//   navigation?: any;
// }

// const IntroScreen: React.FC<IntroScreenProps> = ({ navigation }) => {
//   const carouselRef = useRef<Carousel<any>>(null);
//   const windowWidth = Dimensions.get('window').width;
//   const [activeSlide, setActiveSlide] = useState(0);

//   const insets = useSafeAreaInsets();




//   // Carousel data
//   const carouselItems =
//    [
//           {
//             id: 1,
//             title: 'Find Your Perfect Vibe',
//             text: 'Start your journey with curiosity, not appearances. \n Answer playful, meaningful prompts that reveal your personality, values, and vibe. \n The more you share, the more the app learns who’s truly aligned.',
//           },
//           {
//             id: 2,
//             title: 'Answer Thoughtful Prompts',
//             text: 'Browse blurred profiles and show your interest through curiosity, not swipes. Explore real people, not just pictures. Your feed evolves based on who you vibe with most.',
//           },
//           {
//             id: 3,
//             title: 'Find Your True Matches',
//             text: 'When a match is mutual, the Vault opens. Inside, unlock fun questions and challenges tier by tier. Designed to deepen your connection before the first message is sent and photos are revealed.',
//           },
//         ];

//   // Render carousel item
//   const renderItem = ({ item }: { item: any }) => {
//     return (
//       <View style={styles.carouselItem}>
//       <Walkthrough/>
//         <Text
//           style={[
//             styles.titleText,
//             { color: colors.white },
//           ]}
//         >
//           {item.title}
//         </Text>
//         <Text
//           style={[
//             styles.discriptionText,
//             { color: colors.lightGray },
//           ]}
//         >
//           {item.text}
//         </Text>
//       </View>
//     );
//   };

//   // Pagination dots component
//   const PaginationDots = () => {
//     return (
//       <View style={styles.paginationContainer}>
//         {carouselItems.map((_, index) => {
//           const isActive = index === activeSlide;
//           return (
//             <View
//               key={index}
//               style={[
//                 styles.paginationDot,
//                 {
//                   backgroundColor: isActive ? colors.violate : colors.fontgary,
//                   width: isActive ? getWidth(4) : getWidth(2),
//                   opacity: isActive ? 1 : 0.6,
//                 },
//               ]}
//             />
//           );
//         })}
//       </View>
//     );
//   };

//   return (
//     <LinearGradient
//       colors={['rgba(140,80,253,0.07)', 'rgba(140,80,253,0.03)']}
//       style={[
//         styles.container,
//         { backgroundColor: colors.primary_blue },
//       ]}
//     >
//       {/* Main content with carousel */}
//       <View style={styles.contentContainer}>
//         {/* Carousel */}
//         <View style={styles.carouselContainer}>
//           <Carousel
//             ref={carouselRef}
//             data={carouselItems}
//             renderItem={renderItem}
//             sliderWidth={windowWidth}
//             itemWidth={windowWidth * 0.95}
//             layout="default"
//             autoplay
//             autoplayInterval={3000}
//             loop={false} // keep false for dot sync
//             firstItem={0} // ensures correct initial state
//             enableMomentum={false}
//             lockScrollWhileSnapping={true}
//             onSnapToItem={(index) => {
//               const safeIndex = Math.max(0, Math.min(index, carouselItems.length - 1));
//               setActiveSlide(safeIndex);
//             }}
//           />
//           <PaginationDots />
//         </View>
//       </View>

//       {/* Buttons container */}
//       <View style={styles.buttonsContainer}>
//         <Buttons
//           onPress={() => navigation.navigate('SignUpScreen')}
//           title={'Start Exploring'}
//           isCap={false}
//           style={[styles.btn, styles.signUpBtn]}
//           txtStyle={[styles.btnText]}
//         />
       
//       </View>
//       {insets.bottom > 0 && (
//             Platform.OS == 'android' ? <View style={{ height: insets.bottom }} /> : null)}
//     </LinearGradient>
//   );
// };

import React from 'react';
import { Text, View, Platform, StyleSheet } from 'react-native';

const FontDebugger = () => {
  // Test all possible font name variations
  const testPatterns = [
    // Exact filename matches (without extension)
    'Blacker-Display-Bold-trial',
    'Blacker-Display-Regular-trial',
    'Blacker-Display-Light-trial',
    'Blacker-Display-Medium-trial',
    'PlusJakartaSans-Bold',
    'PlusJakartaSans-Regular',
    'PlusJakartaSans-Light',
    'PlusJakartaSans-Medium',
    'PlusJakartaSans-SemiBold',
    
    // Common iOS patterns
    'BlackerDisplayTrial-Bold',
    'BlackerDisplayTrial-Regular',
    'BlackerDisplayTrial-Light',
    'BlackerDisplayTrial-Medium',
    
    // Family name with weights
    'Blacker Display Trial',
    'Plus Jakarta Sans',
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Font Debugger - Platform: {Platform.OS}
      </Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Testing Font Family Names:</Text>
        {testPatterns.map((font, index) => (
          <Text 
            key={index} 
            style={[
              styles.testText,
              { fontFamily: font }
            ]}
            numberOfLines={1}
          >
            {index + 1}. {font} - ABCabc123
          </Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>System Font (Comparison):</Text>
        <Text style={styles.testText}>
          System Font - ABCabc123
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Debug Info:</Text>
        <Text style={styles.debugText}>
          • Platform: {Platform.OS}
        </Text>
        <Text style={styles.debugText}>
          • File extensions should be .ttf or .otf
        </Text>
        <Text style={styles.debugText}>
          • Check Info.plist for iOS font declarations
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 50,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#666',
  },
  testText: {
    fontSize: 14,
    marginBottom: 5,
    padding: 5,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
  },
  debugText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 3,
  },
});

export default FontDebugger;