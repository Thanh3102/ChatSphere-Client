import {
  ModalBody,
  ModalContent,
  ModalHeader,
  Tab,
  Tabs,
} from "@nextui-org/react";
import ConversationMembers from "./ConversationMembers";
import { useAppSelector } from "@/app/libs/hooks";

export default function ConversationGroupInfo() {
  const { conversation: { members } = {} } = useAppSelector(
    (state) => state.conversation
  );

  return (
    <>
      <ModalHeader>Thành viên</ModalHeader>
      <ModalBody>
        <Tabs
          fullWidth
          classNames={{ panel: "h-[400px] overflow-y-auto no-scrollbar" }}
        >
          <Tab key="photos" title="Tất cả">
            <ConversationMembers members={members ?? []} />
          </Tab>
          <Tab key="music" title="Quản trị viên">
            <ConversationMembers
              members={
                members?.filter(
                  (member) => member.role === "admin" || member.role === "owner"
                ) ?? []
              }
            />
          </Tab>
        </Tabs>
      </ModalBody>
    </>
  );
}
