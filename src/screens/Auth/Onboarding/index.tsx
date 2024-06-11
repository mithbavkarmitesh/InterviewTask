import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import Swiper from "react-native-swiper";
import {
  Onboarding2,
  Onboarding1,
  Onboarding3,
  Onboarding4,
  Onboarding5,
  ForwardIcon,
} from "@/theme/assets/svg";
import Images from "@/theme/assets/images";
import { SafeScreen } from "@/components/template";
import { BaseText, BaseView, ImageVariant } from "@/components/atoms";
import { useTheme } from "@/theme";
import forwardIcon from "@/theme/assets/images/icons/forwardIcon.png";
import { staticFontStyles } from "@/theme/fonts";
import { Brand } from "@/components/molecules";
import LinearGradient from "react-native-linear-gradient";
import { ROUTES } from "@/utils/routes";
import useTypedNavigation from "@/navigators/hooks";
import RootNavigation from "@/navigators/helper";
import { useTypedDispatch } from "@/store";
import { setUserFirstInstall } from "@/store/commonSlice";

enum ScreenType {
  GET_STARTED,
  ONBOARDING,
}
const slides = [
  {
    key: "slide1",
    title: "Discover a New Way to Stay Connected",
    text: "Connect on Treefe Share moments, stay close, create lasting family memories.",
    image: <Onboarding1 height={200} width={200} />,
  },
  {
    key: "slide2",
    title: "Create Your Family Hub",
    text: "Effortlessly set up family hub, invite, share updates, and stay connected.",
    image: <Onboarding2 height={200} width={200} />,
  },
  {
    key: "slide3",
    title: "Capture and Share Moments",
    text: "Capture, share moments instantly, connecting loved ones, anytime, anywhere.",
    image: <Onboarding3 height={200} width={200} />,
  },
  {
    key: "slide4",
    title: "Plan Together",
    text: "Seamlessly coordinate events, give gifts, plan birthdays, and family gatherings effortlessly.",
    image: <Onboarding4 height={200} width={200} />,
  },
  {
    key: "slide5",
    title: "Private and Secure",
    text: "Prioritize family privacy: secure space for exclusive sharing and communication.",
    image: <Onboarding5 height={200} width={200} />,
  },
];

const SlidingPages = () => {
  const { colors, variant, backgrounds, fonts, layout } = useTheme();
  const [currentIndex, setCurrentIndex] = useState<any>(0);
  const [currentScreen, setCurrentScreen] = useState<any>(
    ScreenType.ONBOARDING
  );
  const navigation = useTypedNavigation();
  const dispatch = useTypedDispatch();
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    if (currentIndex === slides.length - 1) {
      setCurrentScreen(ScreenType.GET_STARTED);
    }
  }, [currentIndex]);

  const onIndexChanged = (index: number) => {
    setCurrentIndex(index);
  };

  const goToNextSlide = () => {
    if (currentIndex === slides.length - 1) {
      setCurrentScreen(ScreenType.GET_STARTED);
    } else {
      swiperRef.current!.scrollBy(1);
    }
  };

  const skipSlides = () => {
    dispatch(setUserFirstInstall(true));
    RootNavigation.reset(ROUTES.LOGINSCREEN);
  };

  /**
   * Get Started Press Handler
   * @returns void
   */
  const handlePressOnStart = () => skipSlides();

  return (
    <SafeScreen
      safeViewStyle={{ backgroundColor: colors.onboardingBackground }}
    >
      {currentScreen === ScreenType.ONBOARDING ? (
        <Swiper
          ref={swiperRef}
          loop={false}
          showsButtons={false}
          // autoplay={true}
          autoplayTimeout={2.5}
          onIndexChanged={onIndexChanged}
          paginationStyle={styles.paginationStyle}
          dotStyle={styles.dotStyle}
          activeDotStyle={styles.activeDotStyle}
          renderPagination={(index, total) => {
            return (
              <BaseView
                style={[
                  styles.paginationWrapper,
                  { backgroundColor: colors.onboardingBackground },
                ]}
              >
                <TouchableOpacity onPress={skipSlides}>
                  <BaseText textWeight={"medium"} style={styles.skipText}>
                    Skip
                  </BaseText>
                </TouchableOpacity>
                <BaseView
                  style={[
                    styles.dotContainer,
                    { backgroundColor: colors.onboardingBackground },
                  ]}
                >
                  {Array.from({ length: total }, (_, i) => (
                    <TouchableOpacity
                      key={i}
                      style={[
                        styles.dotStyle,
                        backgrounds.paginationDotColor,
                        index === i && { backgroundColor: "#709C3C" },
                      ]}
                      onPress={() => swiperRef.current?.scrollTo(i)}
                    />
                  ))}
                </BaseView>
                <TouchableOpacity
                  onPress={goToNextSlide}
                  style={styles.nextContainer}
                >
                  <BaseText textWeight={"medium"} style={[styles.nextText]}>
                    Next
                  </BaseText>
                  <ImageVariant
                    source={forwardIcon}
                    style={[
                      styles.nextIcon,
                      {
                        tintColor:
                          variant === "default" ? "#709C3C" : "#E4E8D7",
                      },
                    ]}
                    sourceDark={forwardIcon}
                    resizeMode={"contain"}
                  />
                </TouchableOpacity>
              </BaseView>
            );
          }}
        >
          {slides.map((slide) => (
            <BaseView
              style={[
                styles.slide,
                { backgroundColor: colors.onboardingBackground },
              ]}
              key={slide.key}
            >
              <BaseView
                style={{
                  marginTop: 90,
                  backgroundColor: colors.onboardingBackground,
                }}
              >
                {slide.image}
              </BaseView>
              <BaseText
                textWeight={"bold"}
                style={[styles.title, fonts.size_16]}
              >
                {slide.title}
              </BaseText>
              <BaseText textWeight={"medium"} style={styles.text}>
                {slide.text}
              </BaseText>
            </BaseView>
          ))}
        </Swiper>
      ) : (
        <BaseView
          style={[
            layout.flex_1,
            layout.justifyBetween,
            { backgroundColor: colors.onboardingBackground },
          ]}
        >
          <BaseView
            style={[
              layout.itemsCenter,
              { backgroundColor: colors.onboardingBackground },
            ]}
          >
            <BaseView
              style={[
                layout.itemsCenter,
                { marginTop: 90, backgroundColor: colors.onboardingBackground },
              ]}
            >
              <Brand
                containerStyle={{
                  backgroundColor: colors.onboardingBackground,
                }}
                height={200}
                width={200}
              />
            </BaseView>
            <BaseText textWeight={"bold"} style={[styles.title, fonts.size_16]}>
              Get Started Now!
            </BaseText>
            <BaseText textWeight={"medium"} style={styles.text}>
              Build family bonds with Treefe today, start your connected
              journey.
            </BaseText>
          </BaseView>
          <TouchableOpacity style={styles.button} onPress={handlePressOnStart}>
            <LinearGradient
              colors={[colors.gradient1, colors.gradient2]} // Start and end colors of the gradient
              style={styles.gradient}
              start={{ x: 0, y: 0 }} // Horizontal gradient
              end={{ x: 1, y: 0 }}
            >
              <Text style={[styles.buttonText, fonts.boldFont]}>
                Get Started
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          {/* <BaseView style={{ backgroundColor: "green", marginBottom: 50 }}>
            <BaseText textWeight={"bold"} style={[styles.title, fonts.size_16]}>
              Get Started
            </BaseText>
          </BaseView> */}
        </BaseView>
      )}
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  paginationStyle: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  paginationWrapper: {
    flexDirection: "row",
    position: "absolute",
    bottom: 16,
    left: 25,
    right: 8,
    justifyContent: "space-between",
    alignItems: "center",
  },
  dotContainer: {
    flexDirection: "row",
  },
  dotStyle: {
    // backgroundColor: "rgba(0,0,0,.2)",
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDotStyle: {
    backgroundColor: "#709C3C",
  },
  skipText: {
    fontSize: 18,
    // Add additional styles for the skip button if needed
  },
  nextContainer: { flexDirection: "row", alignItems: "center" },
  nextText: {
    fontSize: 18,
    textAlign: "center",
    // Add additional styles for the next button if needed
  },
  nextIcon: { paddingLeft: 20, height: 30, width: 30 },
  slide: {
    flex: 1,
    // justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 300, // Set a fixed width for consistency
    height: 300, // Set a fixed height for consistency
    resizeMode: "contain",
  },
  title: {
    fontSize: 24,
    marginTop: 30,
    textAlign: "center",
    maxWidth: "70%",
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 30,
    marginHorizontal: 30,
  },
  pagination: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center", // Center the pagination dots
  },
  dot: {
    backgroundColor: "rgba(0,0,0,.2)",
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#007aff",
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    marginHorizontal: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
  gradient: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 3, // Apply the border radius to the LinearGradient
    alignItems: "center", // Center the text inside the LinearGradient
    justifyContent: "center", // Center the text inside the LinearGradient
    width: "100%", // Make the button extend full width
    // width: 250, // Set a fixed width for the button
    height: 50, // Set a fixed height for the button
  },
});

export default SlidingPages;
