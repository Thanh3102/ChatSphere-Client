import { useAppDispatch, useAppSelector } from "@/app/libs/hooks";
import { Fragment, useEffect, useRef } from "react";
import { getSession, useSession } from "next-auth/react";
import ConversationMessageItem from "./ConversationMessageItem";
import {
  addNewMessage,
  addNewPinMessage,
  recallMessage,
  removePinMessage,
} from "@/app/libs/redux/slices/ConversationSlice";
import { getSocket } from "@/socket";
import {
  NEW_MESSAGE_EVENT,
  PIN_MESSAGE_EVENT,
  RECALL_MESSAGE_EVENT,
  UN_PIN_MESSAGE_EVENT,
} from "@/app/shared/constants/SocketEvent";
import { ConversationMessage as ConversationMessageType } from "@/app/shared/types/conversation";
import { Spinner } from "@nextui-org/react";

interface Props {
  messages: ConversationMessageType[];
}

export default function ConversationMessage({ messages }: Props) {
  const { data: session } = useSession();
  const { conversation, focusMessage } = useAppSelector(
    (state) => state.conversation
  );
  const dispatch = useAppDispatch();
  const containerRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<{ [key: string]: HTMLDivElement }>({});

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight + 100;
    }
  };

  useEffect(() => {
    const io = getSocket();

    io.on(NEW_MESSAGE_EVENT, async (newMessage: ConversationMessageType) => {
      await dispatch(addNewMessage(newMessage));
      if (
        newMessage.sender.id === session?.user.id &&
        newMessage.type !== "notification"
      ) {
        scrollToBottom();
      }
    });

    io.on(PIN_MESSAGE_EVENT, async (newPinMessage: ConversationMessageType) => {
      await dispatch(addNewPinMessage(newPinMessage));
    });

    io.on(UN_PIN_MESSAGE_EVENT, async (pinMessage: ConversationMessageType) => {
      await dispatch(removePinMessage(pinMessage));
    });

    io.on(
      RECALL_MESSAGE_EVENT,
      async (conversationId: string, messageId: string) => {
        if (conversation && conversation.id === conversationId) {
          dispatch(recallMessage(messageId));
        }
      }
    );

    scrollToBottom();

    if (containerRef.current) {
      containerRef.current.addEventListener("scroll", () => {
        if (containerRef.current) {
          console.log("Top", containerRef.current.scrollTop);
          console.log("Height", containerRef.current.scrollHeight);
        }
      });
    }

    return () => {
      io.off(NEW_MESSAGE_EVENT);
      io.off(PIN_MESSAGE_EVENT);
      io.off(UN_PIN_MESSAGE_EVENT);
      io.off(RECALL_MESSAGE_EVENT);
    };
  }, []);

  useEffect(() => {
    if (focusMessage) {
      messagesRef.current[focusMessage.id].scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [focusMessage]);

  return (
    <Fragment>
      <div
        className="flex-1 px-3 min-h-0 overflow-y-auto overflow-x-hidden"
        ref={containerRef}
      >
        {false && (
          <div className="h-10 flex justify-center items-center">
            <Spinner />
          </div>
        )}
        {messages.map((mess) => (
          <ConversationMessageItem
            ref={(el: any) => (messagesRef.current[mess.id] = el)}
            message={mess}
            key={mess.id}
            currentUserId={session?.user.id}
          />
        ))}
      </div>
    </Fragment>
  );
}
