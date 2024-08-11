"use client";
import Navbar from "../../components/layouts/conversation/navbar/Navbar";
import { Fragment, ReactNode, useEffect, useRef, useState } from "react";
import { getSocket } from "@/socket";
import ContentBox from "../../components/pages/conversation/ConversationBox";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import CallComing from "@/app/components/pages/conversation/CallComing";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spinner,
} from "@nextui-org/react";
import { setOpenPinMessage } from "@/app/libs/redux/slices/ConversationSlice";
import ConversationPinMessageList from "@/app/components/pages/conversation/ConversationPinMessageList";
import { useAppDispatch, useAppSelector } from "@/app/libs/hooks";
interface Props {
  children: ReactNode;
}

interface CallInfo {
  room: string;
  from: {
    name: string;
    avatar: string;
  };
  type: "video" | "voice";
}

export default function ConversationLayout({ children }: Props) {
  const { data: session, status } = useSession();
  const [isReceiveCall, setIsReceiveCall] = useState<boolean>(false);
  const [callInfo, setCallInfo] = useState<CallInfo>();
  const dispatch = useAppDispatch();
  const { openPinMessage, conversation } = useAppSelector(
    (state) => state.conversation
  );

  useEffect(() => {
    if (session?.user) {
      const socket = getSocket();
      socket.emit("setUserId", session?.user.id);
      socket.on("inviteCall", (callInfo) => {
        setCallInfo(callInfo);
        setIsReceiveCall(true);
      });
      socket.on("error", ({ message }) => {
        toast.error(message);
      });

      return () => {
        socket.off("inviteCall");
        socket.off("error");
      };
    }
  }, [status]);

  if (status === "loading" || !session?.user) {
    return (
      <div className="flex gap-4 h-full w-full justify-center items-center absolute top-0 bottom-0 right-0 left-0">
        <Spinner />
        <span className="text-xl font-bold">
          Đang tải, vui lòng đợi giây lát...
        </span>
      </div>
    );
  }

  return (
    <Fragment>
      {isReceiveCall && callInfo && (
        <CallComing
          close={() => setIsReceiveCall(false)}
          from={callInfo.from}
          room={callInfo.room}
          type={callInfo.type}
        />
      )}
      <div className="bg-gray-200 h-screen py-4 overflow-hidden">
        <div className="px-5 flex -mx-2 h-full gap-4">
          <Navbar />
          <ContentBox />
          <div className="h-full flex-[3] min-w-0">{children}</div>
        </div>
      </div>
      
      <Modal
        isOpen={openPinMessage}
        onOpenChange={(open) => dispatch(setOpenPinMessage(open))}
        size="2xl"
        classNames={{
          closeButton: "top-[0.75rem]",
        }}
      >
        <ModalContent>
          <ModalHeader className="flex justify-center items-center">
            Tin nhắn đã ghim
          </ModalHeader>
          {conversation ? (
            <ModalBody>
              <ConversationPinMessageList
                pinMessages={conversation.pinMessages}
              />
            </ModalBody>
          ) : (
            <div className="h-full flex items-center justify-center w-full">
              <Spinner />
            </div>
          )}
        </ModalContent>
      </Modal>
    </Fragment>
  );
}
