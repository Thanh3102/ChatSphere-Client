"use client";
import Navbar from "../../components/layouts/conversation/navbar/Navbar";
import { Fragment, ReactNode, useEffect, useRef, useState } from "react";
import { getSocket } from "@/socket";
import ContentBox from "../../components/pages/conversation/ConversationBox";
import { useSession } from "next-auth/react";
import { Spinner } from "@nextui-org/react";
import toast from "react-hot-toast";
import CallComing from "@/app/components/pages/conversation/CallComing";

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
          <div className="h-full flex-[3] min-w-0">
            {children}
          </div>
        </div>
      </div>
    </Fragment>
  );
}
