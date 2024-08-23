"use client";
import {
  CONVERSATION_ADD_NEW_MEMBER_ROUTE,
  SEARCH_USER_BY_NAME_ROUTE,
} from "@/app/shared/constants/ApiRoute";
import { UserBasicInfo } from "@/app/shared/types/user";
import {
  Avatar,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react";
import { getSession } from "next-auth/react";
import { useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import RenderIf from "../../ui/RenderIf";
import { useAppDispatch, useAppSelector } from "@/app/libs/hooks";
import { useImmer } from "use-immer";
import { MdOutlineDone } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import toast from "react-hot-toast";
import { setOpenAddMember } from "@/app/libs/redux/slices/ConversationSlice";

interface Props {
  isOpen: boolean;
  onOpenChange: ((isOpen: boolean) => void) | undefined;
}

export default function ConversationAddMemberModal({
  isOpen,
  onOpenChange,
}: Props) {
  const [findResult, setFindResult] = useState<UserBasicInfo[]>([]);
  const [addMembers, setAddMembers] = useImmer<UserBasicInfo[]>([]);
  const { conversation } = useAppSelector((state) => state.conversation);
  const dispatch = useAppDispatch();

  const findUsers = async (keyword: string) => {
    const session = await getSession();
    if (!session?.accessToken) {
      return [];
    }

    let existUser: string = "";

    conversation?.members.forEach(
      (member) => (existUser += `&skipId=${member.user.id}`)
    );
    const response = await fetch(
      `${SEARCH_USER_BY_NAME_ROUTE}?name=${keyword}${existUser}`,
      {
        method: "GET",
        headers: {
          authorization: `Bearer ${session?.accessToken}`,
        },
      }
    );

    if (response.ok) {
      const res = await response.json();
      const users = res.data;
      setFindResult(users);
    } else {
      setFindResult([]);
    }
  };

  const isUserInAddList = (id: string) => {
    if (addMembers.find((member) => member.id === id)) return true;
    return false;
  };

  const addMember = (user: UserBasicInfo) => {
    setAddMembers((members) => {
      members.push(user);
      return members;
    });
  };

  const removeMember = (id: string) => {
    setAddMembers((members) => {
      const index = members.findIndex((member) => member.id === id);
      if (index !== -1) {
        members.splice(index, 1);
      }
      return members;
    });
  };

  const handleUserResultClick = (user: UserBasicInfo) => {
    if (isUserInAddList(user.id)) {
      removeMember(user.id);
    } else {
      addMember(user);
    }
  };

  const handleAddMemberClick = async () => {
    dispatch(setOpenAddMember(false));
    const session = await getSession();
    const response = await fetch(CONVERSATION_ADD_NEW_MEMBER_ROUTE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${session?.accessToken}`,
      },
      body: JSON.stringify({
        conversationId: conversation?.id,
        newMemberIds: addMembers.map((member) => member.id),
      }),
    });
    if (!response.ok) {
      const res = await response.json();
      toast.error(res.message);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      classNames={{
        closeButton: "top-[0.75rem]",
        header: "flex items-center justify-center",
      }}
      size="lg"
    >
      <ModalContent>
        <ModalHeader>Thêm thành viên</ModalHeader>
        <ModalBody>
          <div className="p-2 border-1 border-gray-500 rounded-md flex gap-2 items-center">
            <IoSearchOutline />
            <input
              type="text"
              className="outline-none w-full"
              placeholder="Tìm kiếm"
              onChange={(e) => findUsers(e.target.value)}
            />
          </div>
          <div className="min-h-20 overflow-y-hidden flex items-center justify-center gap-2 w-full overflow-x-auto">
            <RenderIf condition={addMembers.length === 0}>
              <span className="text-xs text-gray-500">
                Chưa chọn người dùng nào
              </span>
            </RenderIf>
            <RenderIf condition={addMembers.length !== 0}>
              {addMembers.map((member) => (
                <div
                  className="flex flex-col gap-2 w-[80px] py-4 mx-2"
                  key={member.id}
                >
                  <div className="flex items-center justify-center">
                    <div className="max-w-10 max-h-10 relative">
                      <Avatar src={member.image} />
                      <div className="absolute -top-1 -right-1">
                        <div
                          className="p-1 flex items-center justify-center bg-white rounded-full text-xs shadow-md hover:cursor-pointer"
                          onClick={() => removeMember(member.id)}
                        >
                          <IoMdClose />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="w-full text-xs text-gray-500 font-light text-wrap text-center line-clamp-2 max-w-full">
                      {member.name}
                    </span>
                  </div>
                </div>
              ))}
            </RenderIf>
          </div>
          <div className="h-[300px] overflow-y-auto">
            {findResult.map((user) => (
              <div
                className="p-2 flex items-center justify-between hover:bg-gray-100 hover:cursor-pointer rounded-md"
                key={user.id}
                onClick={() => handleUserResultClick(user)}
              >
                <div className="flex items-center gap-2">
                  <div className="max-h-10 max-w-10">
                    <Avatar showFallback src={user.image} />
                  </div>
                  <span className="font-semibold text-sm">{user.name}</span>
                </div>
                {isUserInAddList(user.id) ? (
                  <MdOutlineDone />
                ) : (
                  <div className="w-2 h-2 p-2 rounded-full border-gray-500 border-2" />
                )}
              </div>
            ))}
          </div>
          <div className="my-2">
            <Button
              radius="md"
              color="primary"
              fullWidth
              isDisabled={addMembers.length === 0}
              onClick={handleAddMemberClick}
            >
              Thêm thành viên
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
