"use client";

import { useAppDispatch, useAppSelector } from "@/app/libs/hooks";
import {
  CREATE_CONVERSATION_ROUTE,
  SEND_MESSAGE_ROUTE,
  UPLOAD_FILE_ATTACH_ROUTE,
} from "@/app/shared/constants/ApiRoute";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, Fragment, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { BiSolidLike } from "react-icons/bi";
import { ImAttachment } from "react-icons/im";
import { IoCloseCircle, IoSend } from "react-icons/io5";
import ReplyMessage from "./ReplyMessage";
import { setReplyMessage } from "@/app/libs/redux/slices/ConversationSlice";
import { FaFaceGrinWide, FaMicrophone } from "react-icons/fa6";
import EmojiPicker, {
  Emoji,
  EmojiClickData,
  EmojiStyle,
  Theme,
} from "emoji-picker-react";
import ConversationFileItem from "./ConversationAttachFileItem";
import VoiceRecorder from "./VoiceRecorder";

interface Props {
  conversationId?: string;
}

export default function ConversationSendMsgBox({ conversationId }: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { data: session } = useSession();
  const { members } = useAppSelector((state) => state.newConversation);
  const { replyMessage, conversation } = useAppSelector(
    (state) => state.conversation
  );
  const [message, setMessage] = useState<string>("");
  const [emoji, setEmoji] = useState<string>("1f44d");
  const [files, setFiles] = useState<File[]>([]);
  const [stream, setStream] = useState<MediaStream>();
  const [openVoiceRecord, setOpenVoiceRecord] = useState<boolean>(false);
  const router = useRouter();
  const pathName = usePathname();
  const dispatch = useAppDispatch();
  const fileAttachRef = useRef<HTMLInputElement>(null);

  const createConversation = async (): Promise<{ id: string }> => {
    const response = await fetch(CREATE_CONVERSATION_ROUTE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${session?.accessToken}`,
      },
      body: JSON.stringify({
        members: members,
      }),
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(await response.json());
    }
  };

  const sendMessage = async () => {
    setMessage("");
    setFiles([]);
    dispatch(setReplyMessage(null));

    if (conversationId) {
      await fetchMessage(conversationId);
      await fetchFileAttach(conversationId);
    } else {
      try {
        const { id } = await createConversation();
        await fetchMessage(id);
        await fetchFileAttach(id);
      } catch (error) {
        toast.error(
          "Đã xảy ra lỗi khi tạo cuộc trò chuyện mới. Vui lòng thử lại",
          { position: "top-right" }
        );
      }
    }
  };

  const sendEmoji = async (id: string | undefined) => {
    let conversationId = id;
    if (!conversationId) {
      const { id } = await createConversation();
      conversationId = id;
    }
    const response = await fetch(SEND_MESSAGE_ROUTE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${session?.accessToken}`,
      },
      body: JSON.stringify({
        conversationId: conversationId,
        message: emoji,
        type: "emoji",
        replyMessageId: replyMessage?.id,
      }),
    });
    if (response.ok) {
      if (pathName !== `/conversations/${conversationId}`)
        router.push(`/conversations/${conversationId}`);
    }
  };

  const fetchMessage = async (id: string) => {
    if (message) {
      const response = await fetch(SEND_MESSAGE_ROUTE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({
          conversationId: id,
          message: message,
          replyMessageId: replyMessage?.id,
        }),
      });
      if (response.ok && pathName !== `/conversations/${id}`) {
        router.push(`/conversations/${id}`);
      }
    }
  };

  const fetchFileAttach = async (id: string) => {
    if (files.length !== 0 && id) {
      for (let file of files) {
        const uploadFilePromise = new Promise(async (resolve, reject) => {
          const formData = new FormData();
          formData.append("attachFile", file);
          formData.append("conversationId", id);

          const response = await fetch(UPLOAD_FILE_ATTACH_ROUTE, {
            method: "POST",
            headers: {
              authorization: `Bearer ${session?.accessToken}`,
            },
            body: formData,
          });

          if (response.ok) {
            resolve("Gửi file thành công");
            if (pathName !== `/conversations/${id}`)
              router.push(`/conversations/${id}`);
          } else {
            reject("Đã xảy ra lỗi");
          }
        });
        toast.promise(
          uploadFilePromise,
          {
            loading: "Đang gửi",
            error: "Đã xảy ra lỗi",
            success: "Gửi thành công",
          },
          { position: "bottom-left" }
        );
      }
    }
  };

  const handleOnKeyDown = (e: any) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    let isValid = true;
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      for (const file of newFiles) {
        if (file.size > 26214400) {
          toast.error("File không quá 25 MB", {
            position: "bottom-left",
          });
          isValid = false;
          break;
        }
      }
      if (isValid) {
        setFiles((prevFiles) => [...prevFiles, ...newFiles]);
      }
    }
  };

  const handleFileClick = () => {
    if (fileAttachRef.current) fileAttachRef.current.value = "";
  };

  const handleFileRemove = (fileIndex: number) => {
    setFiles((files) => {
      const newFiles = files.filter((_, index) => index !== fileIndex);
      return newFiles;
    });
  };

  const handleEmojiClick = (emojiObj: EmojiClickData) => {
    console.log(emojiObj);
    setIsOpen(false);

    setMessage((message) => message + emojiObj.emoji);
  };

  const handleOpenVoiceRecord = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStream(stream);
      setOpenVoiceRecord(true);
    } catch (error: any) {
      if (
        error.name === "NotAllowedError" ||
        error.name === "PermissionDeniedError"
      ) {
        toast.error("Bạn cần cấp quyền để có thể ghi âm.", {
          position: "top-center",
        });
      } else {
        console.error("Lỗi khi truy cập vào microphone:", error);
      }
    }
  };

  const handleCloseVoiceRecord = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setOpenVoiceRecord(false);
    setStream(undefined);
  };

  useEffect(() => {
    if (conversation) {
      setEmoji(conversation.emoji);
    }
  }, [conversation?.emoji]);

  return (
    <Fragment>
      {replyMessage && (
        <ReplyMessage message={replyMessage} userId={session?.user.id} />
      )}
      {openVoiceRecord ? (
        <div className="py-4 flex items-center">
          <Tooltip content="Đóng" showArrow placement="top">
            <div
              className="mx-1 p-1 rounded-full hover:bg-gray-100 hover:cursor-pointer"
              onClick={handleCloseVoiceRecord}
            >
              <IoCloseCircle className="text-xl text-blue-500" />
            </div>
          </Tooltip>

          <VoiceRecorder
            stream={stream}
            onClose={handleCloseVoiceRecord}
            conversationId={conversationId}
            createConversation={createConversation}
          />
        </div>
      ) : (
        <div className="py-4 flex">
          <div className="flex flex-col justify-end">
            <div className="flex justify-end mx-1">
              <Fragment>
                <Tooltip content="Gửi clip âm thanh" showArrow placement="top">
                  <div
                    className="mx-1 p-2 rounded-full hover:bg-gray-100 hover:cursor-pointer"
                    onClick={handleOpenVoiceRecord}
                  >
                    <FaMicrophone className="text-xl text-blue-500" />
                  </div>
                </Tooltip>
                <Tooltip content="Đính kèm file" showArrow placement="top">
                  <div
                    className="mx-1 p-2 rounded-full hover:bg-gray-100 hover:cursor-pointer"
                    onClick={() => {
                      if (fileAttachRef.current) fileAttachRef.current.click();
                    }}
                  >
                    <ImAttachment className="text-xl text-blue-500" />
                  </div>
                </Tooltip>
              </Fragment>
            </div>
          </div>
          <div className="flex-1 px-4 bg-gray-200 rounded-3xl min-w-0">
            {files.length !== 0 && !openVoiceRecord && (
              <div className="flex gap-4 pt-3 overflow-x-auto">
                {files.map((file, index) => (
                  <ConversationFileItem
                    file={file}
                    key={index}
                    onClose={() => handleFileRemove(index)}
                  />
                ))}
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Aa"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleOnKeyDown}
                className="py-2 bg-gray-200 outline-none  w-full"
              />
              <Popover
                isOpen={isOpen}
                onOpenChange={(open) => setIsOpen(open)}
                offset={25}
                placement="top"
                classNames={{
                  content: "p-0",
                }}
              >
                <PopoverTrigger>
                  <div className="text-blue-500 hover:cursor-pointer p-1 rounded-full hover:bg-gray-100">
                    <FaFaceGrinWide />
                  </div>
                </PopoverTrigger>
                <PopoverContent>
                  <EmojiPicker
                    onEmojiClick={handleEmojiClick}
                    emojiStyle={EmojiStyle.FACEBOOK}
                    width={350}
                    height={300}
                    searchPlaceholder="Tìm kiếm"
                    previewConfig={{ showPreview: false }}
                    lazyLoadEmojis
                    skinTonesDisabled
                    autoFocusSearch
                  />
                </PopoverContent>
              </Popover>
            </div>

            <input
              type="file"
              name=""
              id=""
              className="hidden"
              ref={fileAttachRef}
              onChange={handleFileChange}
              onClick={handleFileClick}
              multiple={true}
            />
          </div>

          {message || files.length !== 0 ? (
            <div className="flex flex-col justify-end">
              <Tooltip content="Nhấn để gửi" showArrow placement="top">
                <div
                  className="mx-2 p-2 rounded-full hover:bg-gray-100 hover:cursor-pointer"
                  onClick={() => sendMessage()}
                >
                  <IoSend className="text-xl text-blue-500" />
                </div>
              </Tooltip>
            </div>
          ) : (
            <div className=" flex flex-col justify-end">
              <Tooltip
                content={
                  <span className="flex gap-1 items-center">
                    Gửi <Emoji unified={emoji} size={14} />
                  </span>
                }
                showArrow
                placement="top"
              >
                <div
                  className="mx-2 p-2 rounded-full hover:bg-gray-100 hover:cursor-pointer"
                  onClick={() => sendEmoji(conversationId)}
                >
                  <Emoji unified={emoji} size={25} />
                </div>
              </Tooltip>
            </div>
          )}
        </div>
      )}
    </Fragment>
  );
}
