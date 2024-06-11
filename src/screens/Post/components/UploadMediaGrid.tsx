import {
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useCallback } from "react";
import MediaItem from "./MediaItem";
import { MediaList } from "../types";
import { useTheme } from "@/theme";

const UploadMediaGrid = ({
  mediaList,
  removeSelectedMediaHandler,
  allProgress,
}: any) => {
  const { layout } = useTheme();

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<MediaList>) => {
      const onRemoveMedia = () => {
        removeSelectedMediaHandler(index, item?.remoteUri);
      };
      return (
        <MediaItem
          item={item}
          onRemoveMedia={onRemoveMedia}
          allProgress={allProgress}
        />
      );
    },
    [removeSelectedMediaHandler]
  );

  return (
    <FlatList
      data={mediaList}
      renderItem={renderItem}
      keyExtractor={(item, index) => `${index}key`}
      numColumns={3}
      style={styles.container}
      contentContainerStyle={layout.justifyCenter}
    />
  );
};

export default UploadMediaGrid;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
});
