import { Tooltip } from "@nextui-org/react";
import Image from "next/image";
import { FaRegFileAlt } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

interface Props {
  file: File;
  onClose: () => void;
}

const ConversationFileItem = ({ file, onClose }: Props) => {
  if (file.type.startsWith("image")) {
    var imageURL = URL.createObjectURL(file);
    return (
      <div className="relative">
        <Image
          width={56}
          height={56}
          src={imageURL}
          alt=""
          className="rounded-lg relative"
        />
        <Tooltip content="Gỡ file đính kèm">
          <div
            className="absolute bg-white border-[1px] border-gray-400 p-1 rounded-full -right-2 -top-2 hover:bg-gray-100 hover:cursor-pointer"
            onClick={() => onClose()}
          >
            <IoMdClose />
          </div>
        </Tooltip>
      </div>
    );
  } else if (file.type.startsWith("video")) {
    var videoURL = URL.createObjectURL(file);
    return (
      <div className="relative">
        <div className="w-14 h-14 rounded-lg">
          <video
            src={videoURL}
            muted
            
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        </div>
        <Tooltip content="Gỡ file đính kèm">
          <div
            className="absolute bg-white border-[1px] border-gray-400 p-1 rounded-full -right-2 -top-2 hover:bg-gray-100 hover:cursor-pointer"
            onClick={() => onClose()}
          >
            <IoMdClose />
          </div>
        </Tooltip>
      </div>
    );
  } else {
    return (
      <div className="w-40 h-14 p-2 bg-gray-300 rounded-lg flex items-center gap-1 relative">
        <div className="rounded-full p-2 bg-white">
          <FaRegFileAlt className="text-base" />
        </div>
        <p className="w-full line-clamp-2 text-xs font-semibold">{file.name}</p>
        <Tooltip content="Gỡ file đính kèm">
          <div
            className="absolute bg-white border-[1px] border-gray-400 p-1 rounded-full -right-2 -top-2 hover:bg-gray-100 hover:cursor-pointer"
            onClick={() => onClose()}
          >
            <IoMdClose />
          </div>
        </Tooltip>
      </div>
    );
  }
};

export default ConversationFileItem;
