import { useAppDispatch, useAppSelector } from "@/app/libs/hooks";
import { setOpenHeaderInfo } from "@/app/libs/redux/slices/ConversationSlice";
import {
  Button,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spinner,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";

export default function ConversationUserInfo() {
  const { data: session } = useSession();
  const { conversation } = useAppSelector((state) => state.conversation);
  const dispatch = useAppDispatch();
  if (conversation && session?.user) {
    const member =
      conversation.members[0].user.id !== session?.user.id
        ? conversation.members[0]
        : conversation.members[1];
    return (
      <>
        <ModalHeader>Thông tin người dùng</ModalHeader>
        <ModalBody>
          <div className="">
            <p>Name: {member.user.name}</p>
            <p>Email: {member.user.email}</p>
            <Button onClick={() => dispatch(setOpenHeaderInfo(false))}>
              Close
            </Button>
          </div>
        </ModalBody>
      </>
    );
  }
  return <Spinner />;
}
