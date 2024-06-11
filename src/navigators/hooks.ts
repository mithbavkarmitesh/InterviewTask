import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/core";
import { ApplicationStackParamList } from "@/types/navigation";

const useTypedNavigation = () => {
  const navigator =
    useNavigation<StackNavigationProp<ApplicationStackParamList>>();

  return navigator;
};

export default useTypedNavigation;
