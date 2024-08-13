import Image from "next/image";
import { MdOutlinePlayCircle } from "react-icons/md";
import Link from "next/link";
import { useAppSelector } from "@/app/libs/hooks";

export default function ConversationMediaFileList() {
  const { conversation } = useAppSelector((state) => state.conversation);

  return (
    <div className="max-h-full flex flex-wrap -mx-1 -my-1">
      {conversation && conversation.mediaFiles.length !== 0 ? (
        <>
          {conversation.mediaFiles.map((file, index) => {
            if (file.fileType.startsWith("image")) {
              return (
                <div className="px-1 py-1 w-1/3 h-24" key={index}>
                  <Link href={file.fileURL} target="_blank">
                    <div className="w-full h-full relative rounded-lg">
                      <Image
                        src={file.fileURL}
                        alt=""
                        fill
                        className="object-cover"
                      />
                    </div>
                  </Link>
                </div>
              );
            }

            if (file.fileType.startsWith("video")) {
              return (
                <div className="px-1 py-1 w-1/3 h-24" key={index}>
                  <div className="w-full h-full relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-full">
                      <Link href={file.fileURL} target="_blank">
                        <div className="relative w-full h-full">
                          <video
                            src={file.fileURL}
                            muted
                            className="object-cover h-full"
                          />
                          <div className="absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
                            <div className="flex text-3xl justify-center items-center h-full">
                              <MdOutlinePlayCircle />
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            }
          })}
        </>
      ) : (
        <span>Không có file phương tiện nào</span>
      )}
    </div>
  );
}
