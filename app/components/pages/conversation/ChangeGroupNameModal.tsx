import { useAppSelector } from "@/app/libs/hooks";
import { UPDATE_CONVERSATION_SETTING_ROUTE } from "@/app/shared/constants/ApiRoute";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react";
import { getSession } from "next-auth/react";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";

interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}
export default function ChangeGroupNameModal({ isOpen, setIsOpen }: Props) {
  const { conversation } = useAppSelector((state) => state.conversation);
  const [newName, setNewName] = useState<string>(conversation?.groupName ?? "");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const session = await getSession();
    await fetch(`${UPDATE_CONVERSATION_SETTING_ROUTE}`, {
      method: "PUT",
      headers: {
        authorization: `Bearer ${session?.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: conversation?.id,
        groupName: newName,
      }),
    });
    setIsLoading(false);
    setIsOpen(false);
  };

  const isDisable = (newName: string) => {
    if (!conversation?.groupName) return false;
    if (conversation.groupName === newName) return true;
    return false;
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => setIsOpen(open)}
      classNames={{
        closeButton: "top-[0.75rem]",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex items-center justify-center">
          Đổi tên nhóm chat
        </ModalHeader>
        <ModalBody>
          <span className="text-xs">
            Mọi người đều biết khi tên nhóm chat thay đổi
          </span>
          <form onSubmit={handleSubmit}>
            <Input
              label="Tên đoạn chat"
              size="md"
              variant="bordered"
              max={500}
              onChange={(e) => setNewName(e.target.value)}
            />
            <div className="flex gap-2 my-4">
              <Button
                type="button"
                radius="sm"
                fullWidth
                onClick={() => setIsOpen(false)}
              >
                Hủy
              </Button>
              <Button
                color="primary"
                type="submit"
                radius="sm"
                fullWidth
                disabled={isDisable(newName)}
                isLoading={isLoading}
              >
                Lưu
              </Button>
            </div>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
