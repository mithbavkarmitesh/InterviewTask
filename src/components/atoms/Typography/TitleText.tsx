// TitleText.tsx
import React from "react";
import BaseText, { BaseTextProps } from "../BaseText";

interface TitleTextProps extends BaseTextProps {}

const TitleText: React.FC<TitleTextProps> = ({ children, ...restProps }) => {
  return (
    <BaseText textWeight="bold" {...restProps}>
      {children}
    </BaseText>
  );
};

export default TitleText;
