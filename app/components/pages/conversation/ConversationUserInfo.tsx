import { useAppDispatch, useAppSelector } from "@/app/libs/hooks";
import { setOpenHeaderInfo } from "@/app/libs/redux/slices/ConversationSlice";
import { Button, Spinner } from "@nextui-org/react";
import { useSession } from "next-auth/react";

export default function ConversationUserInfo() {
  const { data: session } = useSession();
  const { conversation } = useAppSelector((state) => state.conversation);
  const dispatch = useAppDispatch();
  if (conversation && session?.user) {
    const user =
      conversation.users[0].id !== session?.user.id
        ? conversation.users[0]
        : conversation.users[1];
    return (
      <div className="">
        <p>Name: {user.name}</p>
        <p>Email: {user.email}</p>
        <Button onClick={() => dispatch(setOpenHeaderInfo(false))}>
          Close
        </Button>
      </div>
    );
  }
  return <Spinner />;
}
