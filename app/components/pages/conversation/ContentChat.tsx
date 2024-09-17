"use client";
import Link from "next/link";
import { SelectContent } from "@/app/libs/redux/slices/AppSlice";
import { LuPenSquare } from "react-icons/lu";
import ConversationList from "./ConversationList";
import { GET_USER_CONVERSATION_ROUTE } from "@/app/shared/constants/ApiRoute";
import { ConversationBasicInfo, UserConversation } from "@/app/shared/types/conversation";
import { getSession, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Spinner } from "@nextui-org/react";
import { getSocket } from "@/socket";
import { SOCKET_EVENT } from "@/app/shared/enums";

export default function ContentChat() {
  const [conversations, setConversation] = useState<ConversationBasicInfo[]>([]);

  const getData = async () => {
    const session = await getSession();
    const response = await fetch(GET_USER_CONVERSATION_ROUTE, {
      headers: {
        authorization: `Bearer ${session?.accessToken}`,
      },
    });
    if (response.ok) {
      const res = await response.json();
      setConversation(res.data);
    }
  };

  useEffect(() => {
    getData();
    const io = getSocket();
    io.on(SOCKET_EVENT.RELOAD_CONVERSATION_LIST, () => {
      getData();
    });
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between">
        <span className="font-bold text-2xl">{SelectContent.CHAT}</span>
        <Link href={"/conversations/new"}>
          <div className="rounded-full p-2 hover:bg-gray-100 hover:cursor-pointer">
            <LuPenSquare className="text-xl" />
          </div>
        </Link>
      </div>
      <ConversationList conversations={conversations} />
    </div>
  );
}
