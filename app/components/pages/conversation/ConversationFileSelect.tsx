import { IoDocumentText, IoImages } from "react-icons/io5";

export default function ConversationFileSelect() {
  const handleOpenTab = (tab: string) => {};

  return (
    <>
      <div
        className="px-2 py-3 rounded-lg hover:bg-gray-100 hover:cursor-pointer font-semibold"
        onClick={() => handleOpenTab("mediaFile")}
      >
        <div className="flex gap-2 items-center">
          <div className="p-2 bg-gray-300 rounded-full">
            <IoImages />
          </div>
          <span>File phương tiện</span>
        </div>
      </div>
      <div
        className="px-2 py-3 rounded-lg hover:bg-gray-100 hover:cursor-pointer font-semibold"
        onClick={() => handleOpenTab("file")}
      >
        <div className="flex gap-2 items-center">
          <div className="p-2 bg-gray-300 rounded-full">
            <IoDocumentText />
          </div>
          <span>File</span>
        </div>
      </div>
    </>
  );
}
