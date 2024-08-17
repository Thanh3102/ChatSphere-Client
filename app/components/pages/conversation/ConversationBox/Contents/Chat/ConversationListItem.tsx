"use client";
import { getConversationInfo } from "@/app/shared/helpers/ConversationHelper";
import { UserConversation } from "@/app/shared/types/conversation";
import { Avatar } from "@nextui-org/react";
import { Emoji } from "emoji-picker-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Props {
  conversation: UserConversation;
}
export default function ConversationListItem({ conversation }: Props) {
  const [lastAt, setLastAt] = useState<Date>(conversation.lastMessageAt);
  const { data: session } = useSession();

  const getDiff = (date: Date) => {
    const now = new Date();
    const prev = new Date(date);
    const diff = now.getTime() - prev.getTime();
    const SECOND = 1000;
    const MINUTE = 60 * SECOND;
    const HOUR = 60 * MINUTE;
    const DAY = 24 * HOUR;
    const WEEK = 7 * DAY;
    const YEAR = 52 * WEEK;
    if (diff < MINUTE) {
      return `1 phút`;
    } else if (diff < HOUR) {
      return `${Math.round(diff / MINUTE)} phút`;
    } else if (diff < DAY) {
      return `${Math.round(diff / HOUR)} giờ`;
    } else if (diff < WEEK) {
      return `${Math.round(diff / DAY)} ngày`;
    } else if (diff < YEAR) {
      return `${Math.round(diff / WEEK)} tuần`;
    }
    return `${Math.round(diff / YEAR)} năm`;
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newDate = new Date(lastAt);
      newDate.setMinutes(newDate.getMinutes() + 1);
      setLastAt(newDate);
    }, 1000 * 60);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const info = getConversationInfo(conversation, session?.user.id);
  let content = <></>;
  if (conversation.lastMessage) {
    switch (conversation.lastMessage.type) {
      case "text":
        content = <span>{conversation.lastMessage.body}</span>;
        break;
      case "file":
        content = <span className="italic">{"File đính kèm"}</span>;
        break;
      case "emoji":
        content = <Emoji unified={conversation.lastMessage.body} size={14} />;
    }
  }

  return (
    <Link href={`/conversations/${conversation.id}`}>
      <div className="flex px-2 py-3 hover:cursor-pointer hover:bg-gray-100 rounded-lg">
        <div className="w-10 ">
          <Avatar radius="full" showFallback src={info.avatar} />
        </div>
        <div className="ml-2 basis-1/2 flex-grow min-w-0">
          <p
            className="font-semibold text-base whitespace-nowrap overflow-hidden text-ellipsis inline-block max-w-full"
            title={info.name}
          >
            {info.name}
          </p>
          <div className="text-xs flex items-center text-gray-400 min-w-0">
            <span className="whitespace-nowrap overflow-hidden text-ellipsis inline-block max-w-full">
              {conversation.lastMessage && conversation.lastMessage.recall
                ? "Tin nhắn đã thu hồi"
                : content}
            </span>
            <span className="ml-2 inline-block text-nowrap">{` - ${getDiff(
              conversation.lastMessageAt
            )}`}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
