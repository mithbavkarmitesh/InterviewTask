import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/atoms";
import { hp, wp } from "@/utils/layoutUtils";
import { useQuery } from "@tanstack/react-query";
import {
  getPublicReelsByCategory,
  getUserInterestsAndHobbies,
} from "@/services/posts";
import topics from "@/screens/Auth/TopicSelection/mockdata/topics";
import { useTheme } from "@/theme";

const CategoryList = ({ onPress, selectedCategory }: any) => {
  const { fonts, variant } = useTheme();

  const IS_DARK = variant === "dark";

  const { data: interestsList } = useQuery({
    queryKey: ["interests&Hobbies"],
    queryFn: async () => await getUserInterestsAndHobbies(),
  });

  useEffect(() => {
    if (
      interestsList &&
      interestsList?.length > 0 &&
      selectedCategory?.length === 0
    ) {
      onPress(interestsList?.[0]);
    }
  }, [interestsList]);

  const _renderItem = useCallback(
    ({ item, i }: any): React.ReactElement => {
      const onItemPress = () => {
        onPress(item);
      };

      return (
        <View style={{ paddingRight: wp(5) }}>
          <Button
            variant={item === selectedCategory ? "gradient" : "normal"}
            title={
              topics.find((topic) => topic.tag === item)?.text?.slice(2) ||
              "Photos"
            }
            textStyle={[
              !IS_DARK && item !== selectedCategory ? fonts.green : {},
              { paddingHorizontal: 13 },
            ]}
            containerStyle={
              item !== selectedCategory
                ? {
                    borderWidth: 1,
                    borderColor: "#709C3C",
                  }
                : {}
            }
            onPress={onItemPress}
          />
        </View>
      );
    },
    [selectedCategory]
  );

  return (
    <FlatList
      extraData={interestsList}
      keyExtractor={(_, index) => `key${index}`}
      contentContainerStyle={{
        alignSelf: "stretch",
        paddingVertical: 13,
        paddingHorizontal: 24,
      }}
      horizontal
      onEndReached={() => {}}
      data={interestsList}
      renderItem={_renderItem}
      showsHorizontalScrollIndicator={false}
    />
  );
};

export default CategoryList;

const styles = StyleSheet.create({});
