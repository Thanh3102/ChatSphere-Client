import { useAppDispatch, useAppSelector } from "@/app/libs/hooks";
import {
  addOldFiles,
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
import { GET_CONVERSATION_FILE } from "@/app/shared/constants/ApiRoute";

export default function ConversationFileTabs() {
  const fileContainerRef = useRef<HTMLDivElement>(null);
  const [isLastMediaFile, setIsLastMediaFile] = useState<boolean>(false);
  const [isLastFile, setIsLastFile] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { fileTabSelect, conversation } = useAppSelector(
    (state) => state.conversation
  );

  const dispatch = useAppDispatch();

  const handleBackClick = () => {
    dispatch(setOpenFileList(false));
  };

  const handleTabClick = (tab: any) => {
    dispatch(setFileSelectTab(tab));
  };

  const getMediaFile = async (type: "mediaFile" | "file") => {
    if (isLoading) return;
    if (type === "file" && isLastFile) return;
    if (type === "mediaFile" && isLastMediaFile) return;

    if (conversation) {
      const session = await getSession();
      if (!session?.accessToken) return;
      let before = "";
      switch (type) {
        case "file":
          before =
            conversation.files.length !== 0
              ? conversation.files[
                  conversation.files.length - 1
                ].createdAt.toString()
              : "";
          break;
        case "mediaFile":
          before =
            conversation.mediaFiles.length !== 0
              ? conversation.mediaFiles[
                  conversation.mediaFiles.length - 1
                ].createdAt.toString()
              : "";
          break;
      }
      setIsLoading(true);
      const response = await fetch(
        `${GET_CONVERSATION_FILE}?id=${conversation.id}&before=${before}&type=${type}`,
        {
          headers: {
            authorization: `Bearer ${session.accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        switch (type) {
          case "mediaFile":
            if (data.length == 0) {
              setIsLastMediaFile(true);
            }
            await dispatch(addOldMediaFiles(data));
            break;
          case "file":
            if (data.length == 0) {
              setIsLastFile(true);
            }
            await dispatch(addOldFiles(data));
            break;
        }
      }
      setIsLoading(false);
    }
  };

  const handleScroll = async () => {
    if (fileContainerRef.current) {
      if (
        fileContainerRef.current.scrollTop >=
        fileContainerRef.current.scrollHeight -
          fileContainerRef.current.clientHeight -
          10
      ) {
        getMediaFile(fileTabSelect);
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
  }, [
    conversation?.mediaFiles,
    conversation?.files,
    isLastFile,
    isLastMediaFile,
  ]);

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
