import { ReactNode } from "react";

interface Props {
  modalCustomStyle?: object;
  hasBackdrop?: boolean;
  children?: ReactNode;
}

interface AdditionalProps {
  title?: string;
  buttonText?: string;
  customViewEnable?: boolean;
  onPressButton?: () => void;
  renderCustomContent?: () => JSX.Element;
  show?: () => void;
  hide?: () => void;
  onClose?: () => void;
  onModalHide?: () => void;
}

export type CustomModalWrapperProps = Props & AdditionalProps;
