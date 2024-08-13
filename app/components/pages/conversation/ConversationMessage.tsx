import { useAppDispatch, useAppSelector } from "@/app/libs/hooks";
import { Fragment, useEffect, useRef, useState } from "react";
import { getSession, useSession } from "next-auth/react";
import ConversationMessageItem from "./ConversationMessageItem";
import {
  addNewMessage,
  addNewPinMessage,
  addOldMessage,
  recallMessage,
  removePinMessage,
  setFocusMessage,
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
import { GET_CONVERSATION_OLDER_MESSAGES_ROUTE } from "@/app/shared/constants/ApiRoute";
import toast from "react-hot-toast";
import { FaArrowDown } from "react-icons/fa6";

interface Props {
  messages: ConversationMessageType[];
}

export default function ConversationMessage({ messages }: Props) {
  const { data: session } = useSession();
  const { conversation, focusMessage } = useAppSelector(
    (state) => state.conversation
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFullMessage, setIsFullMessage] = useState<boolean>(false);
  const [showToBottom, setShowToBottom] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const containerRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<{ [key: string]: HTMLDivElement }>({});

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight + 100;
    }
  };

  const scrollCallback = () => {
    if (containerRef.current) {
      if (
        containerRef.current.scrollHeight - containerRef.current.scrollTop >
        containerRef.current.clientHeight + 100
      ) {
        setShowToBottom(true);
      } else {
        setShowToBottom(false);
      }
      if (containerRef.current.scrollTop == 0) {
        getOlderMessages();
      }
    }
  };

  const getOlderMessages = async (
    to?: Date,
    focusMessage?: ConversationMessageType
  ) => {
    if (isLoading || isFullMessage || !conversation) return;
    
    const session = await getSession();
    if (!session?.accessToken) return;

    const prevMessage = conversation.messages[0];
    const beforeDate = prevMessage.createdAt.toString();
    const toDate = to ? to.toString() : "";

    const response = await fetch(
      `${GET_CONVERSATION_OLDER_MESSAGES_ROUTE}?id=${conversation?.id}&before=${beforeDate}&to=${toDate}`,
      {
        headers: {
          authorization: `Bearer ${session?.accessToken}`,
        },
      }
    );

    if (response.ok) {
      const data: { messages: ConversationMessageType[] } =
        await response.json();
      if (data.messages.length == 0) setIsFullMessage(true);
      await dispatch(
        addOldMessage({ messages: data.messages, focusMessage: focusMessage })
      );
      setIsLoading(false);
      if (prevMessage) {
        messagesRef.current[prevMessage?.id].scrollIntoView({
          behavior: "smooth",
        });
      }
    } else {
      const error = await response.json();
      toast.error(error.message);
      setIsLoading(false);
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

    return () => {
      io.off(NEW_MESSAGE_EVENT);
      io.off(PIN_MESSAGE_EVENT);
      io.off(UN_PIN_MESSAGE_EVENT);
      io.off(RECALL_MESSAGE_EVENT);
    };
  }, []);

  useEffect(() => {
    if (conversation && focusMessage) {
      const isMessageLoaded = conversation.messages.find(
        (msg) => msg.id === focusMessage.id
      );
      if (isMessageLoaded) {
        setTimeout(() => {
          if (messagesRef.current[focusMessage.id]) {
            messagesRef.current[focusMessage.id].scrollIntoView({
              behavior: "smooth",
            });
          }
        }, 500);
      } else {
        getOlderMessages(focusMessage.createdAt, focusMessage);
      }
    }
  }, [focusMessage]);

  useEffect(() => {
    containerRef.current?.addEventListener("scroll", scrollCallback);
    return () => {
      containerRef.current?.removeEventListener("scroll", scrollCallback);
    };
  }, [conversation?.messages, isFullMessage]);

  return (
    <Fragment>
      <div
        className="flex-1 px-3 min-h-0 overflow-y-auto overflow-x-hidden relative"
        ref={containerRef}
      >
        {showToBottom && (
          <div className="fixed bottom-[15%] left-1/2 z-20">
            <div
              className="rounded-full p-2 bg-gray-100 hover:cursor-pointer hover:bg-gray-200"
              onClick={scrollToBottom}
            >
              <FaArrowDown />
            </div>
          </div>
        )}
        {isLoading && (
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
