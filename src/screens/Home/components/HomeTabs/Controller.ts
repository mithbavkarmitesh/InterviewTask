import useBackHandlerForExit from "@/hooks/useBackHandlerForExit";
import { useBottomSheetModal } from "@gorhom/bottom-sheet";

const useHomeTabsController = () => {
  const { dismiss } = useBottomSheetModal();

  const handler = () => {
    
    dismiss("commentsModal");
    return true;
  };

  const backHandler = useBackHandlerForExit(handler);
  return {};
};

export default useHomeTabsController;
