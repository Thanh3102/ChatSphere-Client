"use client";
import { Fragment, useEffect, useState } from "react";
import UserSearch from "../../../../components/pages/conversation/UserSearch";
import { useAppSelector } from "@/app/libs/hooks";
import NewConversationMessage from "../../../../components/pages/conversation/NewConversationMessage";
import {
  CHECK_CONVERSATION_EXISTS_ROUTE,
  GET_CONVERSATION_MESSAGES_ROUTE,
} from "@/app/shared/constants/ApiRoute";
import { useSession } from "next-auth/react";
import SendMessageBox from "../../../../components/pages/conversation/ConversationSendMsgBox";
import { useDispatch } from "react-redux";
import {
  setConversationId,
  setIsExists,
  setMessages,
} from "@/app/libs/redux/slices/NewConversationSlice";
import ConversationMessage from "../../../../components/pages/conversation/ConversationMessage";

export default function NewConservationPage() {
  const { members, messages, isExist, conversationId } = useAppSelector(
    (state) => state.newConversation
  );
  const { data: session } = useSession();
  const dispatch = useDispatch();

  const checkExistsConversation = async () => {
    const response = await fetch(`${CHECK_CONVERSATION_EXISTS_ROUTE}`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${session?.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userIds: members.map((member) => member.id) }),
    });

    if (response.ok) {
      const res = await response.json();
      if (res.isExist) {
        dispatch(setConversationId(res.conversationId));
        getMessages(res.conversationId);
      } else {
        dispatch(setIsExists(false));
      }
    } else {
      dispatch(setIsExists(false));
    }
  };

  const getMessages = async (conversationId: string) => {
    const response = await fetch(
      `${GET_CONVERSATION_MESSAGES_ROUTE}?id=${conversationId}`,
      {
        headers: {
          authorization: `Bearer ${session?.accessToken}`,
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      dispatch(setIsExists(true));
      dispatch(setMessages(data.messages));
    }
  };

  useEffect(() => {
    if (isExist && conversationId) {
      getMessages(conversationId);
    }
  }, [conversationId]);

  useEffect(() => {
    checkExistsConversation();
  }, [members]);

  return (
    <div className="flex flex-col h-full bg-white rounded-lg">
      <UserSearch />
      {members.length !== 0 && isExist && conversationId ? (
        <Fragment>
          <ConversationMessage messages={messages} />
          <SendMessageBox conversationId={conversationId} />
        </Fragment>
      ) : (
        <Fragment>
          <NewConversationMessage />
        </Fragment>
      )}
    </div>
  );
}
