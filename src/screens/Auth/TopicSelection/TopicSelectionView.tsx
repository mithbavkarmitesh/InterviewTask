import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { SafeScreen } from "@/components/template";
import {
  BaseView,
  Button,
  Container,
  SubTitleText,
  TitleText,
} from "@/components/atoms";
import { ScrollView } from "react-native-gesture-handler";
import MockTopics from "./mockdata/topics";
import { hp } from "@/utils/layoutUtils";
import { Brand } from "@/components/molecules";
import { useTheme } from "@/theme";

import { ROUTES } from "@/utils/routes";
import useTypedNavigation from "@/navigators/hooks";
import { useRoute } from "@react-navigation/native";
import { TopicSelectionScreenNavigationProp } from "@/types/navigation";
import { useMutation } from "@tanstack/react-query";
import { registerUser, requestJWTToken } from "@/services/auth";
import moment from "moment";
import { regExp } from "@/utils/regex";
import { showErrorToast, showSuccessToast } from "@/utils/toast";
import { setUser } from "@/store/userSlice";
import { useTypedDispatch, useTypedSelector } from "@/store";
import RootNavigation from "@/navigators/helper";
import { getUserInfo } from "@/services/users";
import { saveFcmToken } from "@/services/notifications";

const TopicSelectionView = () => {
  const navigator = useTypedNavigation();
  const { colors, fonts } = useTheme();
  const [selectedTopics, setSelectTopicsById] = useState<Array<number>>([]);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [skipLoading, setSkipLoading] = useState(false);
  const dispatch = useTypedDispatch();

  const params = useRoute<TopicSelectionScreenNavigationProp>()?.params;
  const { fcmToken } = useTypedSelector((store) => store.UserReducer);
  const { mutate: registerUserApi } = useMutation({
    mutationFn: registerUser,
  });
  const { mutate: getAuthToken } = useMutation({
    mutationFn: requestJWTToken,
    onSuccess: ({ message, data }) => {
      dispatch(setUser(data));
      showSuccessToast(message);
      sendFcmToken(data?.username);
      RootNavigation.reset(ROUTES.TABS);
    },
    onSettled: () => {
      setRegisterLoading(false);
      setSkipLoading(false);
    },
  });
  const { mutate: getUsername } = useMutation({
    mutationFn: getUserInfo,
    onSuccess: ({ data: { username, password } }) => {
      getAuthToken({ username, password });
    },
    onError: () => {
      showErrorToast("Something went wrong");
      setRegisterLoading(false);
      setSkipLoading(false);
    },
  });

  const sendFcmToken = async (username: string) => {
    try {
      const res = await saveFcmToken({
        userName: username,
        fcmToken: fcmToken,
        deviceType: "android",
      });
    } catch (error) {
      
    }
  };

  const getSelectedTopicsText = () => {
    return selectedTopics
      .map((selectedId) => {
        const selectedTopic = MockTopics.find(
          (topic) => topic.id === selectedId
        );
        return selectedTopic ? selectedTopic.tag : null;
      })
      ?.filter((topic) => topic != null) as string[];
  };

  const objectToFormData = (obj: Record<string, any>, customKeys = {}) => {
    const formData = new FormData();
    const result = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const formDataKey = customKeys[key] || key; // Use custom key if provided
        if (formDataKey === "dateOfBirth") {
          result[formDataKey] = moment(obj[key], "DD/MM/YYYY")?.format(
            "YYYY-MM-DD"
          );
        } else {
          result[formDataKey] = obj[key];
        }
      }
    }
    
    formData.append("userData", JSON.stringify(result));
    return formData;
  };

  const customKeys = {
    firstName: "name",
    lastName: "surname",
    username: "email",
    mobileNumber: "mobileNo",
    topics: "interestAndHobbies",
    dob: "dateOfBirth",
    maritalStatus: "married",
    maidenName: "maidenSurname",
  };
  const handleSubmit = (type: "submit" | "skip") => {
    if (!params?.fields) return;
    const parseFields = JSON.parse(params?.fields);
    type === "submit" ? setRegisterLoading(true) : setSkipLoading(true);

    const selectedTopicsByName = getSelectedTopicsText();
    const payloadObject =
      type === "submit"
        ? {
            ...parseFields,
            topics: selectedTopicsByName,
            password: "12345",
            role: "user",
          }
        : { ...parseFields, password: "12345", role: "user" };
    const formData = objectToFormData(payloadObject, customKeys);
    
    registerUserApi(formData, {
      onError: (error) => {
        
        showErrorToast(error?.message);
        type === "submit" ? setRegisterLoading(false) : setSkipLoading(false);
      },
      onSuccess: (data) => {
        
        if (data.code === 200) {
          // navigator.navigate(ROUTES.TABS);
          getUsername(parseFields?.mobileNumber);
        }
      },
    });
  };

  const TopicsMapComponent = () => {
    return (
      <BaseView
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 10,
          paddingVertical: hp(21),
          justifyContent: "center",
        }}
      >
        {MockTopics.map((topic) => {
          return (
            <Button
              key={topic.id}
              title={topic.text}
              variant="gradient"
              onPress={() => {
                if (selectedTopics.includes(topic.id)) {
                  setSelectTopicsById((prev) =>
                    prev.filter((id) => id !== topic.id)
                  );
                } else setSelectTopicsById((prev) => [...prev, topic.id]);
              }}
              containerStyle={{
                minHeight: 20,
                borderRadius: 30,
                borderColor: "#709C3C",
                borderWidth: 2,
              }}
              gradientColors={
                selectedTopics.includes(topic.id)
                  ? undefined
                  : [colors.topicBackground, colors.topicBackground]
              }
              textStyle={{
                paddingVertical: 5,
                paddingHorizontal: 10,
                color: selectedTopics.includes(topic.id)
                  ? "#E9EDDF"
                  : colors.topicTextColor,
              }}
            />
          );
        })}
      </BaseView>
    );
  };
  return (
    <SafeScreen>
      <BaseView row>
        <Brand width={80} height={80} />
      </BaseView>
      <TitleText style={{ textAlign: "center", marginTop: 20 }}>
        What are you into right now?
      </TitleText>
      <SubTitleText style={{ textAlign: "center" }}>
        Choose at least 5 topics
      </SubTitleText>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end" }}
      >
        <TopicsMapComponent />
        <Container
          style={{
            justifyContent: "flex-end",
          }}
        >
          <Button
            disabled={selectedTopics.length < 5}
            variant="gradient"
            onPress={() => handleSubmit("submit")}
            title="Submit"
            style={{ width: "100%", marginTop: 20 }}
            containerStyle={{ alignSelf: "stretch", height: hp(40) }}
            textStyle={[fonts.bold, fonts.boldFont, fonts.size_16, fonts.white]}
            isLoading={registerLoading}
          />
          <Button
            variant="gradient"
            onPress={() => handleSubmit("skip")}
            title="Skip for Now"
            style={{ width: "100%", marginVertical: 20 }}
            containerStyle={{
              alignSelf: "stretch",
              height: hp(40),
            }}
            gradientColors={["#1C1C1C", "#1C1C1C"]}
            textStyle={[fonts.bold, fonts.boldFont, fonts.size_16, fonts.white]}
          />
        </Container>
      </ScrollView>
    </SafeScreen>
  );
};

export default TopicSelectionView;

const styles = StyleSheet.create({});
