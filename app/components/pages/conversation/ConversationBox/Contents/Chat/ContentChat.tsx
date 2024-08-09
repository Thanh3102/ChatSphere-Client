"use client";
import Link from "next/link";
import { SelectContent } from "@/app/libs/redux/slices/AppSlice";
import { LuPenSquare } from "react-icons/lu";
import ConversationList from "./ConversationList";
import { GET_USER_CONVERSATION_ROUTE } from "@/app/shared/constants/ApiRoute";
import { ConversationBasicInfo, UserConversation } from "@/app/shared/types/conversation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Spinner } from "@nextui-org/react";
import { getSocket } from "@/socket";
import { NEW_MESSAGE_EVENT, RELOAD_CONVERSATION_LIST_EVENT } from "@/app/shared/constants/SocketEvent";

export default function ContentChat() {
  const [conversations, setConversation] = useState<UserConversation[]>(
    []
  );
  const { data: session, status } = useSession();
  const getData = async () => {
    const response = await fetch(GET_USER_CONVERSATION_ROUTE, {
      headers: {
        authorization: `Bearer ${session?.accessToken}`,
      },
    });
    if (response.ok) {
      const res: { data: UserConversation[] } = await response.json();
      setConversation(res.data);
    }
  };

  useEffect(() => {
    getData();
    const io = getSocket();
    io.on(RELOAD_CONVERSATION_LIST_EVENT, () => {
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
      {status === "loading" ? (
        <Spinner />
      ) : (
        <ConversationList conversations={conversations} />
      )}
    </div>
  );
}
