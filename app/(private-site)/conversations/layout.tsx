"use client";
import Navbar from "../../components/layouts/conversation/navbar/Navbar";
import { Fragment, ReactNode, useEffect, useState } from "react";
import { getSocket } from "@/socket";
import ContentBox from "../../components/pages/conversation/ConversationBox";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import CallComing from "@/app/components/pages/conversation/CallComing";
import { Spinner } from "@nextui-org/react";

import { useAppDispatch, useAppSelector } from "@/app/libs/hooks";
import { SOCKET_EVENT } from "@/app/shared/enums";
import RenderIf from "@/app/components/ui/RenderIf";
import PinMessageModal from "@/app/components/pages/conversation/PinMessageModal";
import { setOpenPinMessage } from "@/app/libs/redux/slices/ConversationSlice";
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
  const dispatch = useAppDispatch();
  const { data: session, status } = useSession();
  const [isReceiveCall, setIsReceiveCall] = useState<boolean>(false);
  const [callInfo, setCallInfo] = useState<CallInfo>();
  const { openPinMessage, conversation } = useAppSelector(
    (state) => state.conversation
  );

  useEffect(() => {
    if (session?.user) {
      const socket = getSocket();
      socket.emit(SOCKET_EVENT.SET_USER_ID, session?.user.id);
      socket.on(SOCKET_EVENT.INVITE_CALL, (callInfo) => {
        setCallInfo(callInfo);
        setIsReceiveCall(true);
      });
      socket.on(SOCKET_EVENT.ERROR, ({ message }) => {
        toast.error(message);
      });

      return () => {
        socket.off(SOCKET_EVENT.INVITE_CALL);
        socket.off(SOCKET_EVENT.ERROR);
      };
    }
  }, [status]);

  return (
    <>
      <RenderIf condition={status === "loading" || !session?.user}>
        <div className="flex gap-4 h-full w-full justify-center items-center absolute top-0 bottom-0 right-0 left-0">
          <Spinner />
          <span className="text-xl font-bold">
            Đang tải, vui lòng đợi giây lát...
          </span>
        </div>
      </RenderIf>

      <RenderIf condition={!(status === "loading" || !session?.user)}>
        <Fragment>
          <RenderIf condition={isReceiveCall}>
            {callInfo && (
              <CallComing
                close={() => setIsReceiveCall(false)}
                from={callInfo.from}
                room={callInfo.room}
                type={callInfo.type}
              />
            )}
          </RenderIf>

          <div className="bg-gray-200 h-screen py-4 overflow-hidden">
            <div className="px-5 flex -mx-2 h-full gap-4">
              <Navbar />
              <ContentBox />
              <div className="h-full flex-[3] min-w-0">{children}</div>
            </div>
          </div>

          <PinMessageModal
            isOpen={openPinMessage}
            onOpenChange={(open) => dispatch(setOpenPinMessage(open))}
          />
        </Fragment>
      </RenderIf>
    </>
  );
}
