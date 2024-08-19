import { useAppSelector } from "@/app/libs/hooks";
import { Spinner } from "@nextui-org/react";
import { FaRegFileAlt } from "react-icons/fa";
import RenderIf from "../../ui/RenderIf";

export default function ConversationFileList() {
  const { conversation } = useAppSelector((state) => state.conversation);

  function formatFileSize(byteSize: number) {
    if (byteSize >= 1e9) {
      return (byteSize / 1e9).toFixed(1) + " GB";
    } else if (byteSize >= 1e6) {
      // >= 1 MB
      return (byteSize / 1e6).toFixed(1) + " MB";
    } else if (byteSize >= 1e3) {
      // >= 1 KB
      return (byteSize / 1e3).toFixed(1) + " KB";
    } else {
      // < 1 KB
      return byteSize + " B";
    }
  }

  if (!conversation) {
    return (
      <>
        <Spinner />
      </>
    );
  }

  return (
    <>
      <RenderIf condition={conversation.files.length == 0}>
        <span>Không có file nào</span>
      </RenderIf>
      
      <RenderIf condition={conversation.files.length !== 0}>
        {conversation.files.map((file) => (
          <div className="pb-1 border-b-1 border-gray-200" key={file.id}>
            <div className="w-full px-2 py-3 gap-2 text-sm rounded-lg flex items-center hover:cursor-pointer">
              <div className="p-4 rounded-md bg-gray-100">
                <FaRegFileAlt className="text-base" />
              </div>
              <div className="flex-1 flex flex-col">
                <span
                  className="flex-1 min-w-0 line-clamp-1 font-bold"
                  title={file.fileName}
                >
                  {file.fileName}
                </span>
                <span className="text-xs text-gray-500">
                  {formatFileSize(file.fileSize)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </RenderIf>
    </>
  );
}
