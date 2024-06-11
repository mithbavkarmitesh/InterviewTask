import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  PermissionsAndroid,
  Image,
} from "react-native";
import MapView, {
  MapPressEvent,
  Marker,
  PROVIDER_GOOGLE,
  Region,
} from "react-native-maps";
import Geolocation from "react-native-geolocation-service";
import { GeocodingResponse, LocationModalProps } from "./types";
import { IS_ANDROID, IS_IOS, hp, wp } from "@/utils/layoutUtils";
import { BaseText, BaseView, Button, TitleText } from "@/components/atoms";
import { SafeScreen, ScreenHeader } from "@/components/template";
import { useTheme } from "@/theme";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Images from "@/theme/assets/images";
import darkMode from "./mocks/darkMode.json";
import ky from "ky";
import { debounce } from "lodash";
import { useTypedDispatch } from "@/store";
import { showFullScreenLoader } from "@/store/commonSlice";
//@ts-ignore
navigator.geolocation = require("react-native-geolocation-service");

const LocationModal: React.FC<LocationModalProps> = ({
  visible,
  onClose,
  onLocationConfirm,
}: LocationModalProps) => {
  const { colors, layout, variant } = useTheme();
  const dispatch = useTypedDispatch();
  const googleInputRef = useRef(null);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);

  const isDarkTheme = variant === "dark";

  useEffect(() => {
    async function requestLocationPermission() {
      if (IS_IOS) {
        const auth = await Geolocation.requestAuthorization("whenInUse");
        if (auth === "granted") {
          getLocation();
        }
      }

      if (IS_ANDROID) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "This app needs access to your location.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK", // Add this line
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getLocation();
        }
      }
    }
    if (visible) {
      setMapLoaded(false);
      requestLocationPermission();
    }
  }, [visible]);

  const handleMapLoaded = (event) => {
    setMapLoaded(true);
  };

  const getAddress = ({ latitude, longitude }: any) => {
    let lat = latitude;
    let lng = longitude;
    var xhr = new XMLHttpRequest();
    // LOCATION IQ API
    xhr.open(
      "GET",
      `https://us1.locationiq.com/v1/reverse.php?key=pk.47a11aa73f2ea1e0f6666b1fd369dd1b&lat=${lat}&lon=${lng}&format=json&normalizeaddress=1&matchquality=1`
    );
    xhr.send();
    xhr.onreadystatechange = processRequest;
    xhr.addEventListener("readystatechange", processRequest);
    function processRequest(e: any) {
      if (xhr.readyState == 4 && xhr.status == 200) {
        let response = JSON.parse(xhr.responseText);

        const city =
          response.address?.neighbourhood ||
          response.address?.city ||
          response.address?.residential ||
          response.address?.town ||
          response.address?.county;

        setAddress(city + ", " + response.address.state);
      }
    }
  };
  const getLocation = useCallback(() => {
    if (visible) {
      // Request location permission and get the current location
      Geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLoading(false);
          getAddress(position.coords);
        },
        (error) => {
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      );
    }
  }, [visible]);

  const getCoordinates = (place_id: string) => {
    dispatch(showFullScreenLoader(true));
    ky.get(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(
        place_id
      )}&fields=geometry&key=${encodeURIComponent(
        "AIzaSyBOowe1XK3Pa8p5-dMxj62oe2lM6PXI0aw"
      )}`
    )
      .then((res) => res.json())
      .then((response: any) => {
        if (response.result) {
          const { result } = response;
          const { geometry } = result;

          if (
            geometry &&
            geometry.location &&
            geometry.location.lng &&
            geometry.location.lat
          ) {
            setUserLocation({
              latitude: geometry.location.lat,
              longitude: geometry.location.lng,
            });
            getAddress({
              latitude: geometry.location.lat,
              longitude: geometry.location.lng,
            });
          }
        }
      })
      .catch((error) => {})
      .finally(() => {
        dispatch(showFullScreenLoader(false));
      });
  };

  const handleUserTap = (event: MapPressEvent) => {
    event.stopPropagation();

    const { coordinate, action } = event.nativeEvent;

    if (googleInputRef.current) {
      googleInputRef?.current.blur();
    }
    if (coordinate.latitude && coordinate.longitude) {
      setUserLocation((prev) => ({
        ...prev,
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
      }));
      getAddress({
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
      });
    }
  };

  const SearchIcon = useCallback(() => {
    return (
      <BaseView
        style={{
          justifyContent: "center",
          backgroundColor: colors.cardBackground,
        }}
      >
        <Image
          source={Images.icons.searchInactiveIcon}
          style={{
            width: 24,
            height: 24,
          }}
        />
      </BaseView>
    );
  }, []);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeScreen safeViewStyle={styles.container}>
        <View style={styles.modalContent}>
          <ScreenHeader onBackPress={onClose}>
            <TitleText>Select a location</TitleText>
          </ScreenHeader>
          <View style={{ flex: 1 }}>
            <GooglePlacesAutocomplete
              ref={googleInputRef}
              debounce={500}
              placeholder="Search Location"
              fetchDetails={true}
              onPress={(data, details = null) => {
                // 'details' is provided when fetchDetails = true

                setAddress(data.structured_formatting.main_text);
                if (data.place_id) {
                  getCoordinates(data.place_id);
                }
              }}
              query={{
                key: "AIzaSyBOowe1XK3Pa8p5-dMxj62oe2lM6PXI0aw",
                language: "en",
                location: "lat,lng",
              }}
              currentLocation={true}
              currentLocationLabel="Current location"
              textInputProps={{
                returnKeyType: "search",
                cursorColor: colors.cursorColor,
                placeholderTextColor: isDarkTheme ? "#E4E8D7" : "#355418",
                editable: mapLoaded,
              }}
              minLength={2}
              enablePoweredByContainer={false}
              renderLeftButton={SearchIcon}
              isRowScrollable
              styles={{
                container: styles.mapContainer,
                textInputContainer: [
                  styles.textInputContainer,
                  {
                    backgroundColor: colors.cardBackground,
                    borderColor: "#709C3C",
                    borderWidth: 1,
                    borderRadius: wp(5),
                    paddingHorizontal: wp(10),
                  },
                ],
                textInput: [
                  styles.textInput,
                  {
                    color: isDarkTheme ? "#E4E8D7" : "#355418",
                    backgroundColor: colors.cardBackground,
                  },
                ],
                listView: styles.listView,
                row: {
                  ...styles.row,
                  backgroundColor: colors.cardBackground,
                },
                description: {
                  ...styles.description,
                  color: isDarkTheme ? "#E4E8D7" : "#1C1C1C",
                },
              }}
              selection={{ start: 0 }}
            />
            <MapView
              loadingEnabled
              loadingIndicatorColor={colors.green}
              loadingBackgroundColor={colors.textInputBackground}
              style={styles.map}
              initialRegion={{
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              provider={PROVIDER_GOOGLE}
              userInterfaceStyle={isDarkTheme ? "dark" : "light"}
              customMapStyle={isDarkTheme ? darkMode : undefined}
              region={{
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              onPress={handleUserTap}
              maxZoomLevel={18}
              onMapLoaded={handleMapLoaded}
            >
              <Marker coordinate={userLocation} title="Your Location" />
            </MapView>
          </View>
          {!loading && (
            <Button
              variant="gradient"
              containerStyle={[
                styles.closeButton,
                { backgroundColor: isDarkTheme ? "#2C2C2C" : "white" },
              ]}
              onPress={() => {
                if (mapLoaded) onLocationConfirm({ ...userLocation, address });
              }}
            >
              <BaseText
                style={[
                  styles.closeButtonText,
                  { color: isDarkTheme ? "#E4E8D7" : "#FFFFFF" },
                ]}
              >
                Confirm Location
              </BaseText>
            </Button>
          )}
        </View>
      </SafeScreen>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },
  map: {
    flex: 1,
  },
  closeButton: {
    padding: 10,
    elevation: 4,
    alignItems: "center",
    position: "absolute",
    bottom: 10,
    width: "60%",
  },
  closeButtonText: {
    // color: "white",
    fontWeight: "bold",
  },
  mapContainer: {
    position: "absolute",
    width: "95%",
    zIndex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    top: 10,
    marginBottom: 0,
    paddingVertical: 0,
  },
  placesInputContainer: {
    // width: "100%",
    backgroundColor: "red",
    // borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "red",
  },
  description: { fontSize: 13 },
  textInputContainer: {
    alignItems: "center",
  },
  textInput: {
    marginBottom: 0,
    fontSize: 16,
    color: "black",
  },
  listView: {
    position: "absolute",
    top: 60,
    zIndex: 1,
    borderColor: "#709C3C",
    borderWidth: 1,
  },
  row: {
    width: "100%",
  },
});

export default LocationModal;
