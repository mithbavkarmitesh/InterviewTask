// SubtitleText.tsx
import React from "react";
import BaseText, { BaseTextProps } from "../BaseText";

interface SubtitleTextProps extends BaseTextProps {}

const SubtitleText: React.FC<SubtitleTextProps> = ({
  children,
  ...restProps
}) => {
  return (
    <BaseText textWeight="medium" {...restProps}>
      {children}
    </BaseText>
  );
};

export default SubtitleText;
