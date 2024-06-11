// TabSwitcherMolecule.tsx

import { BaseText, BaseView, SubTitleText } from "@/components/atoms";
import { hp, wp } from "@/utils/layoutUtils";
import { useTheme } from "@react-navigation/native";
import React, { FC } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

interface TabSwitcherMoleculeProps {
  isEmailTab: boolean;
  onSwitchTab: (emailTab: boolean) => void;
}

const LoginTabSwitcherMolecule: FC<TabSwitcherMoleculeProps> = ({
  isEmailTab,
  onSwitchTab,
}) => {
  const {} = useTheme();
  return (
    <BaseView style={styles.tabContainer}>
      <TouchableOpacity
        style={[styles.tab, isEmailTab && styles.activeTab]}
        onPress={() => onSwitchTab(true)}
      >
        <SubTitleText style={styles.tabText}>Email</SubTitleText>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, !isEmailTab && styles.activeTab]}
        onPress={() => onSwitchTab(false)}
      >
        <SubTitleText style={styles.tabText}>Phone Number</SubTitleText>
      </TouchableOpacity>
    </BaseView>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    marginBottom: hp(20),
    paddingHorizontal: wp(5),
    paddingVertical: hp(4),
    backgroundColor: "#476F22",
    borderRadius: wp(5),
  },
  tab: {
    padding: wp(5),
    backgroundColor: "#476F22",
    borderRadius: wp(5),
    flex: 1,
  },
  activeTab: {
    backgroundColor: "#709C3C",
  },
  tabText: {
    color: "white",
    textAlign: "center",
  },
});

export default LoginTabSwitcherMolecule;
