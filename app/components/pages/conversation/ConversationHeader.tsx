import { useAppDispatch, useAppSelector } from "@/app/libs/hooks";
import {
  setOpenHeaderInfo,
  setOpenInfo,
} from "@/app/libs/redux/slices/ConversationSlice";
import { getConversationInfo } from "@/app/shared/helpers/ConversationHelper";
import { Avatar, Modal, ModalContent, Tooltip } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { Fragment, useEffect } from "react";
import { FaPhoneAlt } from "react-icons/fa";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { IoVideocam } from "react-icons/io5";
import ConversationHeaderInfo from "./ConversationHeaderInfo";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { getSocket } from "@/socket";
import { SOCKET_EVENT } from "@/app/shared/enums";
import RenderIf from "../../ui/RenderIf";

export default function ConversationHeader() {
  const { conversation, openInfo, openHeaderInfo } = useAppSelector(
    (state) => state.conversation
  );
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const info = getConversationInfo(conversation, session?.user.id);

  const handleVideoCall = () => {
    if (!conversation) return;

    const socket = getSocket();

    socket.emit(SOCKET_EVENT.START_CALL, {
      type: "video",
      conversationId: conversation.id,
      userId: session?.user.id,
    });
  };

  useEffect(() => {
    const socket = getSocket();
    socket.on(SOCKET_EVENT.ROOM_CREATED, ({ roomId, type }) => {
      const url = `${process.env.NEXT_PUBLIC_CLIENT_BASE_URL}/room/${roomId}?type=${type}`;
      window.open(url, "_blank");
    });

    return () => {
      socket.off(SOCKET_EVENT.ROOM_CREATED);
    };
  }, []);

  return (
    <Fragment>
      <div className="py-3 px-3 flex justify-between items-center shadow-md">
        <div
          className="flex items-center min-w-0 p-1 rounded-lg hover:cursor-pointer hover:bg-gray-100"
          onClick={() => {
            dispatch(setOpenHeaderInfo(true));
          }}
        >
          <div className="w-10">
            <Avatar showFallback src={info.avatar} />
          </div>
          <div className="min-w-0">
            <span className="text-ellipsis text-nowrap inline-block overflow-hidden w-full min-w-0 px-2 font-semibold">
              {info.name}
            </span>
          </div>
        </div>
        <div className="text-blue-500 flex gap-3 text-xl">
          <Tooltip content="Bắt đầu gọi thoại" showArrow placement="bottom">
            <div className="p-2 rounded-full hover:cursor-pointer hover:bg-gray-100">
              <FaPhoneAlt />
            </div>
          </Tooltip>
          <Tooltip content="Bắt đầu gọi video" showArrow placement="bottom">
            <div
              className="p-2 rounded-full hover:cursor-pointer hover:bg-gray-100"
              onClick={handleVideoCall}
            >
              <IoVideocam className="text-2xl" />
            </div>
          </Tooltip>
          <Tooltip
            content="Thông tin cuộc trò chuyện"
            showArrow
            placement="bottom"
          >
            <div
              className="p-2 rounded-full hover:cursor-pointer hover:bg-gray-100"
              onClick={() => dispatch(setOpenInfo(!openInfo))}
            >
              <HiOutlineDotsHorizontal />
            </div>
          </Tooltip>
        </div>
      </div>
      <RenderIf condition={conversation !== undefined}>
        <Modal
          isOpen={openHeaderInfo}
          onOpenChange={(open) => dispatch(setOpenHeaderInfo(open))}
          backdrop="blur"
        >
          <ModalContent>
            <ConversationHeaderInfo isGroup={conversation?.isGroup} />
          </ModalContent>
        </Modal>
      </RenderIf>
    </Fragment>
  );
}
