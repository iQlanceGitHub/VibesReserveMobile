// import React, { useEffect, useRef } from 'react';
// import { View, Text, StyleSheet, Animated, Easing, Dimensions, useColorScheme } from 'react-native';
// import { colors, getHeight } from '../utils/appConstant';

// const { width, height } = Dimensions.get('window');

// const DatingAppLoader = () => {
//     const theme = useColorScheme();
//     const isLight = theme === 'light';

//     // Animation values
//     const glowAnim = useRef(new Animated.Value(0)).current;
//     const bounceAnim = useRef(new Animated.Value(0)).current;

//     // Array for question marks with different positions and colors
//     const questionMarks = [
//         { id: 1, color: '#ff6b6b', top: '20%', left: '30%', delay: 0 },
//         { id: 2, color: '#6b47ee', top: '60%', left: '20%', delay: 200 },
//         { id: 3, color: '#4ecdc4', top: '40%', left: '70%', delay: 400 },
//         { id: 4, color: '#ffbe0b', top: '70%', left: '60%', delay: 600 },
//         { id: 5, color: '#ff6b6b', top: '20%', left: '60%', delay: 800 },
//     ];

//     // Glow animation for the key
//     useEffect(() => {
//         Animated.loop(
//             Animated.sequence([
//                 Animated.timing(glowAnim, {
//                     toValue: 1,
//                     duration: 1000,
//                     easing: Easing.inOut(Easing.ease),
//                     useNativeDriver: true,
//                 }),
//                 Animated.timing(glowAnim, {
//                     toValue: 0,
//                     duration: 1000,
//                     easing: Easing.inOut(Easing.ease),
//                     useNativeDriver: true,
//                 }),
//             ])
//         ).start();
//     }, [glowAnim]);

//     // Bounce animation for the key
//     useEffect(() => {
//         Animated.loop(
//             Animated.sequence([
//                 Animated.timing(bounceAnim, {
//                     toValue: 1,
//                     duration: 1000,
//                     easing: Easing.inOut(Easing.ease),
//                     useNativeDriver: true,
//                 }),
//                 Animated.timing(bounceAnim, {
//                     toValue: 0,
//                     duration: 1000,
//                     easing: Easing.inOut(Easing.ease),
//                     useNativeDriver: true,
//                 }),
//             ])
//         ).start();
//     }, [bounceAnim]);

//     // Interpolate glow animation
//     const glowInterpolation = glowAnim.interpolate({
//         inputRange: [0, 1],
//         outputRange: [0, 1],
//     });

//     // Interpolate bounce animation
//     const bounceInterpolation = bounceAnim.interpolate({
//         inputRange: [0, 1],
//         outputRange: [0, -20],
//     });

//     return (
//         <View style={[styles.loadingContainer, { backgroundColor: isLight ? '#ffffff' : colors.violate }]}>
//             <View style={styles.animationContainer}>
//                 {/* Glowing and Bouncing Key */}
//                 <Animated.Text
//                     style={[
//                         styles.key,
//                         {
//                             opacity: glowInterpolation,
//                             transform: [{ translateY: bounceInterpolation }],
//                             textShadowRadius: glowInterpolation.interpolate({
//                                 inputRange: [0, 1],
//                                 outputRange: [5, 15]
//                             }),
//                             textShadowColor: 'gold',
//                         }
//                     ]}
//                 >
//                     🔑
//                 </Animated.Text>

//                 {/* Bouncing Question Marks */}
//                 {questionMarks.map((mark) => (
//                     <BouncingQuestionMark
//                         key={mark.id}
//                         color={mark.color}
//                         top={mark.top}
//                         left={mark.left}
//                         delay={mark.delay}
//                     />
//                 ))}
//             </View>

//             <Text style={[styles.loadingText, { color: isLight ? '#000000' : '#ffffff' }]}>
//                 Cooking up curious questions…
//             </Text>
//         </View>
//     );
// };

// // Separate component for each bouncing question mark
// const BouncingQuestionMark = ({ color, top, left, delay }) => {
//     const bounceAnim = useRef(new Animated.Value(0)).current;

//     useEffect(() => {
//         setTimeout(() => {
//             Animated.loop(
//                 Animated.sequence([
//                     Animated.timing(bounceAnim, {
//                         toValue: 1,
//                         duration: 1000,
//                         easing: Easing.inOut(Easing.ease),
//                         useNativeDriver: true,
//                     }),
//                     Animated.timing(bounceAnim, {
//                         toValue: 0,
//                         duration: 1000,
//                         easing: Easing.inOut(Easing.ease),
//                         useNativeDriver: true,
//                     }),
//                 ])
//             ).start();
//         }, delay);
//     }, [bounceAnim, delay]);

//     const bounceInterpolation = bounceAnim.interpolate({
//         inputRange: [0, 1],
//         outputRange: [0, -20],
//     });

//     return (
//         <Animated.Text
//             style={[
//                 styles.questionMark,
//                 {
//                     color,
//                     top,
//                     left,
//                     transform: [{ translateY: bounceInterpolation }],
//                 }
//             ]}
//         >
//             ?
//         </Animated.Text>
//     );
// };

// const styles = StyleSheet.create({
//     loadingContainer: {
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: 20,
//         borderRadius: 20,
//         width: width * 0.8,
//         maxWidth: 250,
//         shadowColor: '#000',
//         shadowOffset: {
//             width: 0,
//             height: 2,
//         },
//         shadowOpacity: 0.25,
//         shadowRadius: 3.84,
//         elevation: 5,
//         alignSelf: 'center', 
//         marginTop: getHeight(20), 
//     },
//     animationContainer: {
//         height: 150,
//         width: '100%',
//         marginBottom: 20,
//         position: 'relative',
//     },
//     key: {
//         fontSize: 48,
//         position: 'absolute',
//         top: '50%',
//         left: '50%',
//         marginLeft: -24,
//         marginTop: -24,
//     },
//     questionMark: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         position: 'absolute',
//     },
//     loadingText: {
//         fontSize: 16,
//         fontWeight: '500',
//         textAlign: 'center',
//     },
// });

// export default DatingAppLoader;

// import React, { useEffect, useRef } from 'react';
// import { View, Text, StyleSheet, Animated, Easing, Dimensions } from 'react-native';

// const { width, height } = Dimensions.get('window');

// // Your color palette
// const colors = {
//   primary_pink: '#FA69B9',
//   white: "#fff",
//   fontgary: "#424148",
//   violate: '#8C50FD',
//   primary_blue: '#0A0735', 
//   black: '#000000',
//   disableGray: '#8B8A91', 
//   lightGray: '#E0E0E0',
//   green: '#66D460', 
//   red: '#FF1F1F',
//   gradiantMixture: '#EEEBF1',
//   photo: '#381946'
// };

// // Loader Type 1: Floating Hearts with Glowing Key
// export const HeartKeyLoader = ({ theme = 'light' }) => {
//   const isLight = theme === 'light';
//   const glowAnim = useRef(new Animated.Value(0)).current;
//   const floatAnim = useRef(new Animated.Value(0)).current;
  
//   const hearts = [
//     { id: 1, size: 20, delay: 0, duration: 3000 },
//     { id: 2, size: 24, delay: 1000, duration: 3500 },
//     { id: 3, size: 18, delay: 500, duration: 4000 },
//     { id: 4, size: 22, delay: 1500, duration: 3200 },
//   ];

//   useEffect(() => {
//     // Glow animation
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(glowAnim, {
//           toValue: 1,
//           duration: 1500,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//         Animated.timing(glowAnim, {
//           toValue: 0,
//           duration: 1500,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();

//     // Float animation
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(floatAnim, {
//           toValue: 1,
//           duration: 2000,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//         Animated.timing(floatAnim, {
//           toValue: 0,
//           duration: 2000,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();
//   }, []);

//   const glowInterpolation = glowAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [1, 1.5],
//   });

//   const floatInterpolation = floatAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, -15],
//   });

//   return (
//     <View style={[styles.loaderContainer, { backgroundColor: isLight ? colors.white : colors.primary_blue }]}>
//       <View style={styles.animationContainer}>
//         {/* Floating Hearts */}
//         {hearts.map(heart => (
//           <FloatingHeart key={heart.id} size={heart.size} delay={heart.delay} duration={heart.duration} />
//         ))}
        
//         {/* Glowing Key */}
//         <Animated.View style={[
//           styles.keyContainer, 
//           { 
//             transform: [
//               { translateY: floatInterpolation },
//               { scale: glowInterpolation }
//             ] 
//           }
//         ]}>
//           <Text style={[styles.key, { color: colors.primary_pink }]}>🔑</Text>
//           <Animated.View style={[
//             styles.glowEffect,
//             { 
//               opacity: glowAnim,
//               backgroundColor: colors.primary_blue,
//             }
//           ]} />
//         </Animated.View>
//       </View>
      
//       <Text style={[styles.loadingText, { color: isLight ? colors.primary_blue : colors.white }]}>
//         Cooking up curious questions…
//       </Text>
//     </View>
//   );
// };

// // Loader Type 2: Pulsating Question Marks
// export const QuestionPulseLoader = ({ theme = 'light' }) => {
//   const isLight = theme === 'light';
//   const pulseAnim = useRef(new Animated.Value(0)).current;
  
//   const questionMarks = [
//     { id: 1, size: 28, delay: 0, color: colors.primary_pink },
//     { id: 2, size: 24, delay: 200, color: colors.violate },
//     { id: 3, size: 32, delay: 400, color: colors.green },
//     { id: 4, size: 22, delay: 600, color: colors.red },
//   ];

//   useEffect(() => {
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(pulseAnim, {
//           toValue: 1,
//           duration: 1000,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//         Animated.timing(pulseAnim, {
//           toValue: 0,
//           duration: 1000,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();
//   }, []);

//   const pulseInterpolation = pulseAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [1, 1.3],
//   });

//   return (
//     <View style={[styles.loaderContainer, { 
//       backgroundColor: isLight ? colors.white : colors.primary_blue,
//       borderWidth: 1,
//       borderColor: isLight ? colors.lightGray : colors.violate
//     }]}>
//       <View style={styles.animationContainer}>
//         {questionMarks.map(mark => (
//           <PulsingQuestionMark 
//             key={mark.id} 
//             size={mark.size} 
//             delay={mark.delay} 
//             color={mark.color}
//             pulseAnim={pulseAnim}
//           />
//         ))}
        
//         <Animated.Text style={[
//           styles.pulseText,
//           { 
//             transform: [{ scale: pulseInterpolation }],
//             color: colors.primary_pink
//           }
//         ]}>
//           ?
//         </Animated.Text>
//       </View>
      
//       <Text style={[styles.loadingText, { color: isLight ? colors.primary_blue : colors.white }]}>
//         Cooking up curious questions…
//       </Text>
//     </View>
//   );
// };

// // Loader Type 3: Romantic Conversation Bubbles
// export const ConversationLoader = ({ theme = 'light' }) => {
//   const isLight = theme === 'light';
//   const bubbleAnim = useRef(new Animated.Value(0)).current;
  
//   const bubbles = [
//     { id: 1, size: 40, delay: 0, left: '20%' },
//     { id: 2, size: 30, delay: 300, left: '60%' },
//     { id: 3, size: 35, delay: 600, left: '40%' },
//   ];

//   useEffect(() => {
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(bubbleAnim, {
//           toValue: 1,
//           duration: 1500,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//         Animated.timing(bubbleAnim, {
//           toValue: 0,
//           duration: 1500,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();
//   }, []);

//   const bubbleInterpolation = bubbleAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, -30],
//   });

//   return (
//     <View style={[styles.loaderContainer, { backgroundColor: isLight ? colors.white : colors.primary_blue }]}>
//       <View style={styles.animationContainer}>
//         {bubbles.map(bubble => (
//           <ConversationBubble 
//             key={bubble.id} 
//             size={bubble.size} 
//             delay={bubble.delay} 
//             left={bubble.left}
//             bubbleAnim={bubbleAnim}
//           />
//         ))}
        
//         <Animated.View style={[
//           styles.heartBubble,
//           { 
//             transform: [{ translateY: bubbleInterpolation }],
//             backgroundColor: colors.primary_pink
//           }
//         ]}>
//           <Text style={styles.heart}>❤️</Text>
//         </Animated.View>
//       </View>
      
//       <Text style={[styles.loadingText, { color: isLight ? colors.primary_blue : colors.white }]}>
//         Cooking up curious questions…
//       </Text>
//     </View>
//   );
// };

// // Helper Components
// const FloatingHeart = ({ size, delay, duration }) => {
//   const floatAnim = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     setTimeout(() => {
//       Animated.loop(
//         Animated.sequence([
//           Animated.timing(floatAnim, {
//             toValue: 1,
//             duration,
//             easing: Easing.inOut(Easing.ease),
//             useNativeDriver: true,
//           }),
//           Animated.timing(floatAnim, {
//             toValue: 0,
//             duration,
//             easing: Easing.inOut(Easing.ease),
//             useNativeDriver: true,
//           }),
//         ])
//       ).start();
//     }, delay);
//   }, []);

//   const floatInterpolation = floatAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, -100],
//   });

//   const opacityInterpolation = floatAnim.interpolate({
//     inputRange: [0, 0.5, 1],
//     outputRange: [0, 1, 0],
//   });

//   const leftInterpolation = floatAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [`${Math.random() * 60 + 20}%`, `${Math.random() * 60 + 20}%`],
//   });

//   return (
//     <Animated.Text
//       style={[
//         styles.floatingHeart,
//         {
//           fontSize: size,
//           opacity: opacityInterpolation,
//           transform: [{ translateY: floatInterpolation }],
//           left: leftInterpolation,
//         }
//       ]}
//     >
//       ❤️
//     </Animated.Text>
//   );
// };

// const PulsingQuestionMark = ({ size, delay, color, pulseAnim }) => {
//   const pulseInterpolation = pulseAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [1, 1.5],
//   });

//   const opacityInterpolation = pulseAnim.interpolate({
//     inputRange: [0, 0.5, 1],
//     outputRange: [0.3, 1, 0.3],
//   });

//   return (
//     <Animated.Text
//       style={[
//         styles.pulsingMark,
//         {
//           fontSize: size,
//           color,
//           opacity: opacityInterpolation,
//           transform: [{ scale: pulseInterpolation }],
//           top: `${Math.random() * 60 + 20}%`,
//           left: `${Math.random() * 60 + 20}%`,
//         }
//       ]}
//     >
//       ?
//     </Animated.Text>
//   );
// };

// const ConversationBubble = ({ size, delay, left, bubbleAnim }) => {
//   const bubbleInterpolation = bubbleAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, -50],
//   });

//   const opacityInterpolation = bubbleAnim.interpolate({
//     inputRange: [0, 0.5, 1],
//     outputRange: [0, 1, 0],
//   });

//   return (
//     <Animated.View
//       style={[
//         styles.bubble,
//         {
//           width: size,
//           height: size,
//           left,
//           opacity: opacityInterpolation,
//           transform: [{ translateY: bubbleInterpolation }],
//           backgroundColor: colors.violate,
//         }
//       ]}
//     >
//       <Text style={[styles.bubbleText, { fontSize: size / 2 }]}>?</Text>
//     </Animated.View>
//   );
// };

// // Styles
// const styles = StyleSheet.create({
//   loaderContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     borderRadius: 20,
//     width: width * 0.8,
//     // maxWidth: 300,
//    // shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     // shadowOpacity: 0.25,
//     // shadowRadius: 3.84,
//     // elevation: 5,
//     alignSelf: 'center', 
//     marginTop: height * 0.2, 
//   },
//   animationContainer: {
//     height: 150,
//     width: '100%',
//     marginBottom: 20,
//     position: 'relative',
//   },
//   loadingText: {
//     fontSize: 16,
//     fontWeight: '500',
//     textAlign: 'center',
//   },
//   keyContainer: {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     marginLeft: -24,
//     marginTop: -24,
//     zIndex: 10,
//   },
//   key: {
//     fontSize: 48,
//     textAlign: 'center',
//   },
//   glowEffect: {
//     position: 'absolute',
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     top: -6,
//     left: -6,
//     zIndex: -1,
//   },
//   floatingHeart: {
//     position: 'absolute',
//     bottom: 0,
//   },
//   pulsingMark: {
//     position: 'absolute',
//     fontWeight: 'bold',
//   },
//   pulseText: {
//     fontSize: 48,
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     marginLeft: -24,
//     marginTop: -24,
//     fontWeight: 'bold',
//   },
//   bubble: {
//     position: 'absolute',
//     bottom: 0,
//     borderRadius: 50,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   bubbleText: {
//     color: colors.white,
//     fontWeight: 'bold',
//   },
//   heartBubble: {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginLeft: -30,
//     marginTop: -30,
//   },
//   heart: {
//     fontSize: 30,
//   },
// });
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Your color palette
const colors = {
  primary_pink: '#FA69B9',
  white: "#fff",
  fontgary: "#424148",
  violate: '#8C50FD',
  primary_blue: '#0A0735', 
  black: '#000000',
  disableGray: '#8B8A91', 
  lightGray: '#E0E0E0',
  green: '#66D460', 
  red: '#FF1F1F',
  gradiantMixture: '#EEEBF1',
  photo: '#381946'
};

// Multi-color options for question marks
const questionMarkColors = [
  colors.primary_pink,
  colors.violate,
  colors.green,
  colors.red,
  colors.photo
];

// Loader Type 1: Pulsing Heart with Floating Question Marks
export const HeartKeyLoader = ({ theme = 'light' }) => {
  const isLight = theme === 'light';
  const pulseAnim = useRef(new Animated.Value(0)).current;
  
  const questionMarks = [
    { id: 1, size: 42, delay: 0, duration: 3000, startX: -60, startY: -80, color: questionMarkColors[0] },
    { id: 2, size: 46, delay: 1000, duration: 3500, startX: 70, startY: -60, color: questionMarkColors[1] },
    { id: 3, size: 40, delay: 500, duration: 4000, startX: -80, startY: 70, color: questionMarkColors[2] },
    { id: 4, size: 44, delay: 1500, duration: 3200, startX: 80, startY: 70, color: questionMarkColors[3] },
  ];

  useEffect(() => {
    // Heart pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const pulseInterpolation = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

  return (
    <View style={[styles.loaderContainer, { backgroundColor: isLight ? colors.white : colors.primary_blue }]}>
      <View style={styles.animationContainer}>
        {/* Floating Question Marks */}
        {questionMarks.map(qm => (
          <FloatingQuestionMark 
            key={qm.id} 
            size={qm.size} 
            delay={qm.delay} 
            duration={qm.duration}
            startX={qm.startX}
            startY={qm.startY}
            color={qm.color}
          />
        ))}
        
        {/* Pulsing Heart */}
        <Animated.View style={[
          styles.heartContainer, 
          { 
            transform: [
              { scale: pulseInterpolation }
            ] 
          }
        ]}>
          <Text style={[styles.heart, { color: colors.primary_pink }]}>❤️</Text>
        </Animated.View>
      </View>
      
      <Text style={[styles.loadingText, { color: isLight ? colors.primary_blue : colors.white }]}>
        Cooking up curious questions…
      </Text>
    </View>
  );
};

// Floating Question Mark Component
const FloatingQuestionMark = ({ size, delay, duration, startX, startY, color }) => {
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnim, {
            toValue: 1,
            duration: duration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(floatAnim, {
            toValue: 0,
            duration: duration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    }, delay);
  }, []);

  const floatInterpolation = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const translateX = floatInterpolation.interpolate({
    inputRange: [0, 1],
    outputRange: [startX, -startX],
  });

  const translateY = floatInterpolation.interpolate({
    inputRange: [0, 1],
    outputRange: [startY, -startY],
  });

  const opacity = floatInterpolation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 1, 0.3],
  });

  const rotate = floatInterpolation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const scale = floatInterpolation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.8, 1.1, 0.8],
  });

  return (
    <Animated.View style={[
      styles.questionMarkContainer,
      {
        transform: [
          { translateX },
          { translateY },
          { rotate },
          { scale }
        ],
        opacity,
      }
    ]}>
      <Text style={[styles.questionMark, { fontSize: size, color }]}>?</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  animationContainer: {
    width: 240, // Increased container size to accommodate larger question marks
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 20,
  },
  heartContainer: {
    position: 'absolute',
    zIndex: 10,
  },
  heart: {
    fontSize: 80, // Increased heart size to maintain proportion with larger question marks
  },
  questionMarkContainer: {
    position: 'absolute',
  },
  questionMark: {
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: 18, // Slightly increased text size
    fontWeight: '500',
    marginTop: 20,
    color: colors.primary_blue,
  },
});

export default HeartKeyLoader;