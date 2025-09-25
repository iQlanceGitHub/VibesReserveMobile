import React, { useRef,  useState } from "react";
import {
  View,
  Text,
  Dimensions,
  Platform,
} from "react-native";
import Carousel from "react-native-snap-carousel";
import { Buttons } from "../../../components/buttons";
import {  getWidth } from "../../../utilis/appConstant";
import { colors } from "../../../utilis/colors";
import LinearGradient from "react-native-linear-gradient";
import styles from "./styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Walkthrough from "../../../assets/svg/walkthrough";

interface IntroScreenProps {
  navigation?: any;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ navigation }) => {
  const carouselRef = useRef<Carousel<any>>(null);
  const windowWidth = Dimensions.get("window").width;
  const [activeSlide, setActiveSlide] = useState(0);
  const buttonArray = ["Start Exploring", "Reserve Now", "Start Your Night"];

  const insets = useSafeAreaInsets();

  // Carousel data
  const carouselItems = [
    {
      id: 1,
      title: "Find Your Perfect Vibe",
      text: "Explore the hottest clubs, bars, and lounges near you. Curated experiences tailored to your mood and style.",
    },
    {
      id: 2,
      title: "Reserve Your Spot in Seconds",
      text: "No more waiting! Book tables, VIP sections, or entry passes instantly and make your night smooth.",
    },
    {
      id: 3,
      title: "Customize Your Night Out",
      text: "Pick your vibe—chill, luxury, party, or live music. The night is yours to design.",
    },
  ];

  // Render carousel item
  const renderItem = ({ item }: { item: any }) => {
    return (
      <View style={styles.carouselItem}>
        <Walkthrough />
        <Text style={[styles.titleText, { color: colors.violate }]}>
          {item.title}
        </Text>
        <Text style={[styles.discriptionText, { color: colors.lightGray }]}>
          {item.text}
        </Text>
      </View>
    );
  };

  // Pagination dots component
  const PaginationDots = () => {
    return (
      <View style={styles.paginationContainer}>
        {carouselItems.map((_, index) => {
          const isActive = index === activeSlide;
          return (
            <View
              key={index}
              style={[
                styles.paginationDot,
                {
                  backgroundColor: isActive ? colors.violate : colors.fontgary,
                  width: isActive ? getWidth(8) : getWidth(2),
                  opacity: isActive ? 1 : 0.6,
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <LinearGradient
      colors={["rgba(140,80,253,0.07)", "rgba(140,80,253,0.03)"]}
      style={[styles.container, { backgroundColor: colors.primary_blue }]}
    >
      {/* Main content with carousel */}
      <View style={styles.contentContainer}>
        {/* Carousel */}
        <View style={styles.carouselContainer}>
          <Carousel
            ref={carouselRef}
            data={carouselItems}
            renderItem={renderItem}
            sliderWidth={windowWidth}
            itemWidth={windowWidth * 0.95}
            layout="default"
            autoplay
            autoplayInterval={3000}
            loop={false} // keep false for dot sync
            firstItem={0} // ensures correct initial state
            enableMomentum={false}
            lockScrollWhileSnapping={true}
            onSnapToItem={(index) => {
              const safeIndex = Math.max(
                0,
                Math.min(index, carouselItems.length - 1)
              );
              setActiveSlide(safeIndex);
            }}
          />
          <PaginationDots />
        </View>
      </View>

      {/* Buttons container */}
      <View style={styles.buttonsContainer}>
        <Buttons
          onPress={() => navigation.navigate("WelcomeScreen")}
          title={buttonArray[activeSlide]}
          isCap={false}
          style={[styles.btn, styles.signUpBtn]}
          txtStyle={[styles.btnText]}
        />
      </View>
      {insets.bottom > 0 &&
        (Platform.OS == "android" ? (
          <View style={{ height: insets.bottom }} />
        ) : null)}
    </LinearGradient>
  );
};

export default IntroScreen;
