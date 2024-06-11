import Modal from "react-native-modal";
import { CustomModalWrapperProps } from "./types";
import React, { forwardRef, useImperativeHandle, useState } from "react";

const CustomModalWrapper = forwardRef<unknown, CustomModalWrapperProps>(
  (props, ref) => {
    const {
      modalCustomStyle,
      hasBackdrop = false,
      children,
      onModalHide,
      // ...rest
    } = props;
    const [isOpen, setIsOpen] = useState(false);
    const show = () => {
      setIsOpen(true);
    };

    const hide = () => {
      setIsOpen(false);
    };

    useImperativeHandle(ref, () => ({
      show,
      hide,
    }));

    return (
      <Modal
        avoidKeyboard
        hasBackdrop={hasBackdrop}
        isVisible={isOpen}
        animationIn={"fadeInUp"}
        animationOut={"fadeOutDown"}
        style={[
          modalCustomStyle,
          { flex: 1, backgroundColor: "rgba(52, 52, 52, 0.6)" },
        ]}
        backdropColor={"rgba(52, 52, 52, 0.6)"}
        onBackdropPress={hide}
        // {...rest}
        onModalHide={onModalHide}
      >
        {children}
      </Modal>
    );
  }
);

CustomModalWrapper.defaultProps = {
  title: "",
  buttonText: "",
  modalCustomStyle: {},
  onClose: () => {},
  customViewEnable: false,
  onPressButton: () => {},
  show: () => {},
  hide: () => {},
  onModalHide: () => {},
};

export default React.memo(CustomModalWrapper);
