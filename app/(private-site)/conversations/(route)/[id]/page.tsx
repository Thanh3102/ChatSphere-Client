"use client";
import { useEffect, useState } from "react";
import SendMessageBox from "../../../../components/pages/conversation/ConversationSendMsgBox";
import ConversationHeader from "../../../../components/pages/conversation/ConversationHeader";
import ConversationMessage from "../../../../components/pages/conversation/ConversationMessage";
import { getSession } from "next-auth/react";
import { GET_CONVERSATION_INFO_ROUTE } from "@/app/shared/constants/ApiRoute";
import { useAppDispatch, useAppSelector } from "@/app/libs/hooks";
import { ConversationBasicInfo } from "@/app/shared/types/conversation";
import { setConversation } from "@/app/libs/redux/slices/ConversationSlice";
import { Spinner } from "@nextui-org/react";
import ConversationDetail from "@/app/components/pages/conversation/ConversationDetail";

interface Props {
  params: { id: string };
}

export default function Page({ params }: Props) {
  const conversationId = params.id;
  const [loading, setLoading] = useState<boolean>(false);
  const { conversation, openInfo } = useAppSelector(
    (state) => state.conversation
  );
  const dispatch = useAppDispatch();
  const getConversationInfo = async () => {
    setLoading(true);
    const session = await getSession();

    const response = await fetch(
      `${GET_CONVERSATION_INFO_ROUTE}?id=${conversationId}`,
      {
        headers: {
          authorization: `Bearer ${session?.accessToken}`,
        },
      }
    );
    const res: ConversationBasicInfo = await response.json();
    if (response.ok) {
      dispatch(setConversation(res));
    }
    setLoading(false);
  };

  useEffect(() => {
    getConversationInfo();
  }, []);

  return (
    <div className="flex h-full gap-4">
      {loading ? (
        <div className="flex items-center justify-center h-full flex-1 rounded-lg bg-white">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="flex flex-col flex-1 min-w-0 rounded-lg bg-white">
            <ConversationHeader />
            {conversation ? (
              <>
                <ConversationMessage messages={conversation.messages} />
                <SendMessageBox conversationId={params.id} />
              </>
            ) : (
              <div className="flex-1">Không thể xem đoạn chat</div>
            )}
          </div>
          {openInfo && <ConversationDetail />}
        </>
      )}
    </div>
  );
}
