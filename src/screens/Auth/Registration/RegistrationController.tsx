import React, { useEffect, useMemo, useRef, useState } from "react";
import { FormFields, Gender, MaritalStatus } from "./types";
import { useRoute } from "@react-navigation/native";
import useTypedNavigation from "@/hooks/useTypedNavigation";
import { ROUTES } from "@/utils/routes";
import { ActionSheetIOS, PermissionsAndroid, Platform } from "react-native";
import Geolocation from "react-native-geolocation-service";
import { showErrorToast } from "@/utils/toast";
import RootNavigation from "@/navigators/helper";
import { RegistrationScreenNavigationProp } from "@/types/navigation";
import { ActionSheetRef } from "react-native-actions-sheet";
import { CameraActions } from "@/types/common";
import ImageCropPicker, { Image } from "react-native-image-crop-picker";
import {
  IS_ANDROID,
  getWindowHeight,
  getWindowWidth,
} from "@/utils/layoutUtils";
import { UploadMediaFilesAPI } from "@/services/media";
import {
  bytesToMegabytes,
  extractBaseUrl,
  getAssetDataFromPath,
  uploadMediaToS3,
} from "@/utils/fileUtils";
import { ImageType } from "@/types/common";
import { storage, useTypedDispatch } from "@/store";
import { getRegionByPincode } from "@/services/common";
import { showFullScreenLoader } from "@/store/commonSlice";

const useRegistrationController = () => {
  //Registration field state
  const [formFields, setFields] = useState<FormFields>({
    firstName: "",
    lastName: "",
    motherName: "",
    fatherName: "",
    pincode: "",
    maritalStatus: "",
    gender: "",
    dob: "",
    maidenName: "",
  });

  const [pincodeEditable, setPincodeEditable] = useState<boolean>(true);
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);
  const [userProfileImage, setUserProfileImage] = useState<ImageType | null>(
    null
  );
  const [progress, setProgress] = useState(0);
  const [errors, setErrors] = useState<Record<keyof FormFields, boolean>>({
    firstName: false,
    lastName: false,
    motherName: false,
    fatherName: false,
    pincode: false,
    maritalStatus: false,
    gender: false,
    dob: false,
    maidenName: false,
  });
  const [formIsValid, setFormIsValid] = useState(false);
  const [stepperValue, setStepperValue] = useState(-2);
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const params = useRoute<RegistrationScreenNavigationProp>()?.params;
  const navigator = useTypedNavigation();
  const dispatch = useTypedDispatch();

  useEffect(() => {
    setTimeout(() => setFormIsValid(validateForm()), 200);
  }, [formFields]);

  useEffect(() => {
    if (params && params?.user) {
      // console.log("Registration Screen ===> ", JSON.stringify(params));
      const { displayPhoto, dob, gender, name } = JSON.parse(params?.user);
      updateDisplayPhoto(displayPhoto);
      updateDOBfield(dob);
      updateGender(gender);
      updateName(name);
    }
  }, [params]);

  const updateDisplayPhoto = (displayPhoto: any) => {
    if (displayPhoto) {
      //@ts-ignore
      setUserProfileImage({ remoteUri: displayPhoto });
    }
  };
  const updateDOBfield = (dob: any) => {
    if (dob && dob?.day && dob?.month && dob?.year) {
      setFields({
        ...formFields,
        dob: `${dob?.day}/${dob?.month}/${dob?.year}`,
      });
    }
  };
  const updateGender = (gender: any) => {
    if (
      gender &&
      gender?.length > 0 &&
      [Gender.Male, Gender.Female].includes(gender)
    ) {
      setFields((prev) => ({
        ...prev,
        gender,
      }));
    }
  };
  const updateName = (name: any) => {
    if (name && name?.firstName && name?.lastName) {
      setFields((prev) => ({
        ...prev,
        firstName: name?.firstName ? name?.firstName : "",
        lastName: name?.lastName ? name?.lastName : "",
      }));
    }
  };

  // Generic input handler for text inputs
  const handleInputChange = (fieldName: keyof FormFields, value: string) => {
    setFields((prevFields) => ({
      ...(prevFields as FormFields),
      [fieldName]: ["firstName", "lastName"].includes(fieldName)
        ? value?.trim()
        : value,
    }));
  };

  // Specific input handler for button states (maritalStatus and gender)
  const handleButtonStateChange = (
    fieldName: "maritalStatus" | "gender",
    value: MaritalStatus | Gender
  ) => {
    setFields((prevFields) => {
      return {
        ...(prevFields as FormFields),
        [fieldName]: value,
        maidenName: "",
      };
    });
  };

  const validateForm = () => {
    let newErrors: Record<keyof FormFields, boolean> = {
      firstName: false,
      lastName: false,
      motherName: false,
      fatherName: false,
      pincode: false,
      maritalStatus: false,
      gender: false,
      dob: false,
      maidenName: false,
    };

    Object.keys(formFields).forEach((key) => {
      const fieldName = key as keyof FormFields;
      const fieldValue = formFields[fieldName];

      // Add your validation logic here

      if (fieldName !== "maidenName")
        newErrors[fieldName] = fieldValue.trim() === "";
      if (
        fieldName === "maidenName" &&
        formFields.gender === Gender.Female &&
        formFields.maritalStatus === MaritalStatus.Married &&
        fieldValue.trim() === ""
      ) {
        newErrors["maidenName"] = true;
      }
    });
    setErrors(newErrors);

    // Return true if there are no errors, false otherwise
    return Object.values(newErrors).every((error) => !error);
  };

  const handleSubmit = () => {
    const isValid = validateForm();

    if (isValid) {
      // Perform the action when the form is valid
      const { pincode, ...restFormFields } = formFields;
      const navParams = JSON.stringify({
        ...restFormFields,
        mobileNumber: params?.countryCode + params?.mobileNumber || "",
        city,
        state,
        country,
      });
      storage.delete("USER_PROFILE_IMAGE_URL");
      storage.set("USER_PROFILE_IMAGE_URL", userProfileImage?.remoteUri || "");

      //Navigate to Intrests and Hobbies
      RootNavigation.reset(ROUTES.TOPIC_SELECTION, { fields: navParams });
    } else {
      // Handle the case when the form is not valid
    }
  };

  useEffect(() => {
    const {
      firstName,
      lastName,
      gender,
      maritalStatus,
      dob,
      motherName,
      fatherName,
      pincode,
    } = formFields;

    // Check if the required fields are filled
    const allRequiredFieldsFilled =
      firstName && lastName && gender && maritalStatus;

    // Check if all fields are filled
    const allFieldsFilled =
      allRequiredFieldsFilled &&
      dob &&
      motherName &&
      fatherName &&
      pincode &&
      (city || state || country);

    // Update the stepper value based on the conditions
    setStepperValue(allFieldsFilled ? 2 : allRequiredFieldsFilled ? 0 : -2);
  }, [formFields]);

  useEffect(() => {
    async function requestLocationPermission() {
      if (Platform.OS === "ios") {
        const auth = await Geolocation.requestAuthorization("whenInUse");
        if (auth === "granted") {
          getLocation();
        }
      }

      if (Platform.OS === "android") {
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
    requestLocationPermission();
  }, []);

  function getLocation() {
    Geolocation.getCurrentPosition(
      (position) => {
        dispatch(showFullScreenLoader(true));
        let lat = position.coords.latitude;
        let lng = position.coords.longitude;
        var xhr = new XMLHttpRequest();
        xhr.open(
          "GET",
          `https://us1.locationiq.com/v1/reverse.php?key=pk.47a11aa73f2ea1e0f6666b1fd369dd1b&lat=${lat}&lon=${lng}&format=json`
        );
        xhr.send();
        xhr.onreadystatechange = processRequest;
        xhr.addEventListener("readystatechange", processRequest);
        function processRequest(e: any) {
          if (xhr.readyState == 4 && xhr.status == 200) {
            let response = JSON.parse(xhr.responseText);
            dispatch(showFullScreenLoader(false));
            const city =
              response.address?.city ||
              response.address?.residential ||
              response.address?.town;
            setCity(city);
            setState(response.address.state);
            setCountry(response.address.country);
            setFields((prev) => ({
              ...prev,
              pincode: response.address.postcode,
            }));
            setPincodeEditable(false);
          }
        }
      },
      (error) => {
        // See error code charts below.
        dispatch(showFullScreenLoader(false));
      },
      { enableHighAccuracy: false, timeout: 5000 }
    );
  }
  const handlePincodeChange = async (text: any) => {
    if (text.length === 6) {
      setFields((prev) => ({ ...prev, pincode: text }));
      // Perform the action when pincode length is exactly 6
      try {
        const data = await getRegionByPincode(text);

        // Check if the data is in the expected format
        if (
          data &&
          data.length > 0 &&
          data[0].PostOffice &&
          data[0].PostOffice.length > 0
        ) {
          // Extract State and Country from each PostOffice entry
          data[0].PostOffice.forEach((postOffice: any) => {
            if (postOffice.State && postOffice.Country) {
              setState(postOffice.State);
              setCountry(postOffice.Country);
              setCity(postOffice.Block);
              setFields((prev) => ({
                ...prev,
                pincode: text,
              }));
            }
          });
        } else {
          setState("");
          setCountry("");
          setCity("");
          setFields((prev) => ({
            ...prev,
            pincode: text,
          }));
        }
      } catch (e) {
        // Handle error condition
        showErrorToast(
          "Error",
          "An error occurred while fetching the region data."
        );
      }
    } else if (text.length < 6) {
      setFields({ ...formFields, pincode: text }); // Update the pincode only if its length is less than 6
    }
  };

  const uploadHandler = async ({
    path,
    size,
  }: {
    path: string;
    size: number;
  }) => {
    try {
      dispatch(showFullScreenLoader(true));
      const { fileName, extension } = getAssetDataFromPath(path);
      const mediaFile = [
        {
          fileSize: bytesToMegabytes(size),
          fileName,
          extension,
        },
      ];
      const response = await UploadMediaFilesAPI(mediaFile);
      if (response && Array.isArray(response)) {
        response.forEach(async (media) => {
          const mediaRemoteUri = extractBaseUrl(media.url);
          try {
            const response = await uploadMediaToS3(
              media.url,
              path,
              (sent, total) => {
                const progress = Math.round((sent * 100) / total);
                if (progress % 10 === 0 || progress === 100)
                  setProgress(progress);
              }
            );
            if (response && mediaRemoteUri) {
              dispatch(showFullScreenLoader(false));

              setUserProfileImage((prev) => {
                if (prev?.path)
                  return {
                    ...prev,
                    remoteUri: mediaRemoteUri,
                  };
                return prev;
              });
            }
          } catch (error) {
            dispatch(showFullScreenLoader(false));

            throw error;
          }
        });
      }
    } catch (error) {
      showErrorToast("Something went wrong while uploading display picture");
      dispatch(showFullScreenLoader(false));
    } finally {
    }
  };

  const captureImage = async () => {
    ImageCropPicker.openCamera({
      width: Math.floor(0.875 * getWindowWidth()),
      height: Math.floor(0.475 * getWindowHeight()),
      cropping: true,
      mediaType: "photo",
    })
      .then(async (image) => {
        setUserProfileImage(image);
        await uploadHandler({ path: image.path, size: image.size });
      })
      .catch((error) => {})
      .finally(() => {
        if (IS_ANDROID) actionSheetRef?.current?.hide();
      });
  };

  const openImageLibrary = async (mediaType: "photo") => {
    ImageCropPicker.openPicker({
      cropping: true,
      multiple: false,
      mediaType: "photo",
      width: Math.floor(0.875 * getWindowWidth()),
      height: Math.floor(0.475 * getWindowHeight()),
    })
      .then(async (image) => {
        setUserProfileImage(image);
        await uploadHandler({ path: image.path, size: image.size });
      })
      .catch((error) => {})
      .finally(() => {
        if (IS_ANDROID) actionSheetRef?.current?.hide();
      });
  };

  const onMediaIconPressIOS = (type: "0" | "1") =>
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: [
          type === "0" ? CameraActions.Photo : CameraActions.Video,
          CameraActions.Gallery,
          CameraActions.Cancel,
        ],
        destructiveButtonIndex: 2,
        cancelButtonIndex: 2,
        title: type === "0" ? "Select Image" : "Select Video",
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          type === "0" ? captureImage() : undefined /* captureVideo() */;
        } else if (buttonIndex === 1) {
          type === "0"
            ? openImageLibrary("photo")
            : undefined /*  openVideoLibrary() */;
        } else if (buttonIndex === 2) {
        }
      }
    );

  return {
    actionSheetRef,
    formFields,
    errors,
    handleInputChange,
    handleButtonStateChange,
    handleSubmit,
    formIsValid,
    stepperValue,
    pincodeEditable,
    city,
    state,
    country,
    handlePincodeChange,
    onMediaIconPressIOS,
    userProfileImage,
    progress,
    captureImage,
    openImageLibrary,
  };
};

export default useRegistrationController;
