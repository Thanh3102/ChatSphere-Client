import { useAppDispatch, useAppSelector } from "@/app/libs/hooks";
import {
  setFileSelectTab,
  setOpenFileList,
} from "@/app/libs/redux/slices/ConversationSlice";
import { Tab, Tabs } from "@nextui-org/react";
import { FaArrowLeft } from "react-icons/fa6";

export default function ConversationFileList() {
  const { fileTabSelect } = useAppSelector((state) => state.conversation);
  const dispatch = useAppDispatch();

  const handleBackClick = () => {
    dispatch(setOpenFileList(false));
  };

  const handleTabClick = (tab: any) => {
    dispatch(setFileSelectTab(tab));
  };

  return (
    <div className="h-full overflow-y-auto flex-[0.5] bg-white rounded-lg px-2">
      <div
        className="p-3 w-fit rounded-full hover:bg-gray-100 hover:cursor-pointer my-2"
        onClick={handleBackClick}
      >
        <FaArrowLeft />
      </div>
      <Tabs
        fullWidth
        classNames={{}}
        selectedKey={fileTabSelect}
        size="lg"
        radius="lg"
        variant="bordered"
        onSelectionChange={(key) => handleTabClick(key)}
      >
        <Tab
          key="mediaFile"
          title="File phương tiện"
        >
          <span className="">Tab 1</span>
        </Tab>
        <Tab key="file" title="File">
          <div className="">Tab 2</div>
        </Tab>
      </Tabs>
    </div>
  );
}
