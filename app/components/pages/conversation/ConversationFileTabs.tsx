import { useAppDispatch, useAppSelector } from "@/app/libs/hooks";
import {
  addOldMediaFiles,
  setFileSelectTab,
  setOpenFileList,
} from "@/app/libs/redux/slices/ConversationSlice";
import { Tab, Tabs } from "@nextui-org/react";
import { FaArrowLeft } from "react-icons/fa6";
import ConversationFileList from "./ConversationFileList";
import ConversationMediaFileList from "./ConversationMediaFileList";
import { useEffect, useRef, useState } from "react";
import { getSession } from "next-auth/react";
import { GET_CONVERSATION_MEDIA_FILE } from "@/app/shared/constants/ApiRoute";

export default function ConversationFileTabs() {
  const fileContainerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { fileTabSelect, conversation, oldestMediaFile } = useAppSelector(
    (state) => state.conversation
  );
  const dispatch = useAppDispatch();

  const handleBackClick = () => {
    dispatch(setOpenFileList(false));
  };

  const handleTabClick = (tab: any) => {
    dispatch(setFileSelectTab(tab));
  };

  const getMediaFile = async (id: string, accessToken: string) => {
    if (!oldestMediaFile) return;

    const before = oldestMediaFile.createdAt.toString();
    setIsLoading(true);

    const response = await fetch(
      `${GET_CONVERSATION_MEDIA_FILE}?id=${id}&before=${before}`,
      {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      dispatch(addOldMediaFiles(data));
    }

    setIsLoading(false);
  };

  const handleScroll = async () => {
    if (fileContainerRef.current) {
      if (
        fileContainerRef.current.scrollTop >=
        fileContainerRef.current.scrollHeight -
          fileContainerRef.current.clientHeight
      ) {
        const session = await getSession();
        if (!session?.accessToken || !conversation) return;

        if (fileTabSelect === "mediaFile") {
          getMediaFile(conversation.id, session.accessToken);
        }
      }
    }
  };

  useEffect(() => {
    if (fileContainerRef.current) {
      fileContainerRef.current.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (fileContainerRef.current) {
        fileContainerRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, [oldestMediaFile]);

  return (
    <div
      className="h-full overflow-y-auto flex-[0.5] bg-white rounded-lg px-2 flex flex-col"
      ref={fileContainerRef}
    >
      <div
        className="p-3 w-fit rounded-full hover:bg-gray-100 hover:cursor-pointer my-2"
        onClick={handleBackClick}
      >
        <FaArrowLeft />
      </div>
      <div className="flex-1 min-w-0 flex flex-col">
        <Tabs
          fullWidth
          selectedKey={fileTabSelect}
          size="lg"
          radius="lg"
          variant="bordered"
          onSelectionChange={(key) => handleTabClick(key)}
          classNames={{
            panel: "flex-1 min-w-0",
          }}
        >
          <Tab key="mediaFile" title="File phương tiện">
            <ConversationMediaFileList />
          </Tab>
          <Tab key="file" title="File">
            <ConversationFileList />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
