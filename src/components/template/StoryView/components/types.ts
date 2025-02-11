import { RefObject } from "react";
import type {
  MultiStoryRef,
  UserProps,
  CallbackProps,
} from "react-native-story-view";

export interface HeaderProps extends Partial<CallbackProps>, UserProps {
  multiStoryRef?: RefObject<MultiStoryRef> | null;
  closeStoryView: () => void;
}

export interface FooterProps extends Partial<CallbackProps> {}
