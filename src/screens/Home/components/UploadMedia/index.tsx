import { View, Text, SafeAreaView, StyleSheet } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ModalWrapper from "@/components/molecules/ModalWrapper";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { CameraPage } from "@/components/template/CameraModal";

const UploadMedia = ({ onClose, isVisible }: any) => {
  const [capturedMedia, setCapturedMedia] = useState<any>();

  const cameraModalRef = useRef(null);

  const hideCameraModal = useCallback(() => {
    cameraModalRef.current?.hide();
    onClose();
  }, [cameraModalRef.current]);

  const showCameraModal = useCallback(() => {
    setCapturedMedia(undefined);
    cameraModalRef.current?.show();
  }, [cameraModalRef.current]);

  useEffect(() => {
    if (isVisible) showCameraModal();
  }, [isVisible]);
  return (
    <ModalWrapper
      ref={cameraModalRef}
      onModalHide={() => {
        if (capturedMedia) {
          
          //   setTimeout(() => handleMediaFileStats(capturedMedia), 500);
        }
      }}
      modalCustomStyle={styles.wrapperStyle}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView>
          <CameraPage
            hideCameraModal={hideCameraModal}
            onMediaFileCaptured={(stats, type) => {
              if (stats && type) {
                // if (type === "photo" && quantityOfImageTypeFiles() >= 5) {
                //   AddListHelper.showErrorToast(MAX_UPLOAD_LIMIT);
                //   hideCameraModal();
                //   return;
                // }
                // if (type === "video" && quantityOfVideoTypeFiles() >= 1) {
                //   AddListHelper.showErrorToast(MAX_UPLOAD_LIMIT);
                //   hideCameraModal();
                //   return;
                // }

                setCapturedMedia(stats);
              }
              hideCameraModal();
            }}
          />
        </SafeAreaView>
      </GestureHandlerRootView>
    </ModalWrapper>
  );
};

export default UploadMedia;

const styles = StyleSheet.create({
  wrapperStyle: {
    margin: 0,
  },
});
