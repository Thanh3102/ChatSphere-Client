"use client";
import { ConversationMember } from "@/app/shared/types/conversation";
import {
  Avatar,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { ImUserMinus } from "react-icons/im";
import { IoIosMore } from "react-icons/io";
import RenderIf from "../../ui/RenderIf";
import { getSession, useSession } from "next-auth/react";
import { useState } from "react";
import { useAppSelector } from "@/app/libs/hooks";
import { BiShieldQuarter } from "react-icons/bi";
import { IoExitOutline } from "react-icons/io5";
import {
  CONVERSATION_DOWNGRADE_MEMBER_ROUTE,
  CONVERSATION_LEFT_GROUP_ROUTE,
  CONVERSATION_PROMOTE_MEMBER_ROUTE,
  CONVERSATION_REMOVE_MEMBER_ROUTE,
} from "@/app/shared/constants/ApiRoute";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface Props {
  member: ConversationMember;
  currentUserRole: string;
}

export default function ConversationMemberItem({
  member,
  currentUserRole,
}: Props) {
  const { data: session } = useSession();
  const { conversation } = useAppSelector((state) => state.conversation);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleRemoveMember = async () => {
    setIsOpen(false);
    const session = await getSession();
    const response = await fetch(CONVERSATION_REMOVE_MEMBER_ROUTE, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${session?.accessToken}`,
      },
      body: JSON.stringify({
        conversationId: conversation?.id,
        removeId: member.id,
      }),
    });
    if (response.ok) {
      toast.success(`Đã xóa ${member.user.name} khỏi nhóm`);
    }
  };

  const handlePromoteMember = async () => {
    setIsOpen(false);
    const session = await getSession();

    const response = await fetch(CONVERSATION_PROMOTE_MEMBER_ROUTE, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${session?.accessToken}`,
      },
      body: JSON.stringify({
        memberId: member.id,
      }),
    });
    if (response.ok) {
      toast.success(`${member.user.name} đã trở thành quản trị viên`);
    }
  };

  const handleDowngradeMember = async () => {
    setIsOpen(false);
    const session = await getSession();
    const response = await fetch(CONVERSATION_DOWNGRADE_MEMBER_ROUTE, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${session?.accessToken}`,
      },
      body: JSON.stringify({
        memberId: member.id,
      }),
    });
    if (response.ok) {
      toast.success(`${member.user.name} đã mất quyền quản trị viên`);
    }
  };

  const handleLeftConversation = async () => {
    setIsOpen(false);
    const session = await getSession();
    const response = await fetch(CONVERSATION_LEFT_GROUP_ROUTE, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${session?.accessToken}`,
      },
      body: JSON.stringify({
        memberId: member.id,
      }),
    });
    if (response.ok) {
      toast.success(`Đã rời nhóm`);
      window.location.reload();
    }
  };

  const isHasDeletePerm = () => {
    if (member.role === "owner") return false;
    if (currentUserRole === "owner" || currentUserRole === "admin") return true;
    return false;
  };

  return (
    <div className="p-2 flex items-center gap-1">
      <div className="flex-1 min-w-0 flex items-center gap-2">
        <div className="h-10 w-10">
          <Avatar src={member.user.image} showFallback />
        </div>
        <div className="flex flex-col">
          <span className="font-semibold overflow-hidden text-ellipsis whitespace-nowrap text-sm">
            {member.user.name}
          </span>
          <RenderIf condition={member.role === "owner"}>
            <span className="font-normal text-gray-500 text-xs">
              Người tạo nhóm
            </span>
          </RenderIf>
          <RenderIf condition={member.role === "admin"}>
            <span className="font-normal text-gray-500 text-xs">
              Quản trị viên
            </span>
          </RenderIf>
          <RenderIf condition={member.role === "member"}>
            <span className="font-normal text-gray-500 text-xs">
              Thêm bởi {member.addedUser.name}
            </span>
          </RenderIf>
        </div>
      </div>
      <Popover isOpen={isOpen} onOpenChange={(open) => setIsOpen(open)}>
        <PopoverTrigger>
          <div className="p-1 hover:bg-gray-100 hover:cursor-pointer rounded-full">
            <IoIosMore />
          </div>
        </PopoverTrigger>
        <PopoverContent>
          <RenderIf
            condition={
              currentUserRole === "owner" &&
              member.role === "admin" &&
              member.user.id !== session?.user.id
            }
          >
            <div
              className="py-3 px-2 flex gap-2 items-center rounded-md hover:bg-gray-100 hover:cursor-pointer w-full"
              onClick={handleDowngradeMember}
            >
              <div className="p-1 rounded-full hover:cursor-pointer">
                <BiShieldQuarter />
              </div>
              <span className="font-semibold text-sm">
                Xóa quyền quản trị viên
              </span>
            </div>
          </RenderIf>
          <RenderIf
            condition={
              member.user.id !== session?.user.id &&
              member.role === "member" &&
              (currentUserRole === "owner" || currentUserRole === "admin")
            }
          >
            <div
              className="py-3 px-2 flex gap-2 items-center rounded-md hover:bg-gray-100 hover:cursor-pointer w-full"
              onClick={handlePromoteMember}
            >
              <div className="p-1 rounded-full hover:cursor-pointer">
                <BiShieldQuarter />
              </div>
              <span className="font-semibold text-sm">
                Chỉ định làm quản trị viên
              </span>
            </div>
          </RenderIf>
          <RenderIf
            condition={member.user.id !== session?.user.id && isHasDeletePerm()}
          >
            <div
              className="py-3 px-2 flex gap-2 items-center rounded-md hover:bg-gray-100 hover:cursor-pointer w-full"
              onClick={handleRemoveMember}
            >
              <div className="p-1 rounded-full hover:cursor-pointer">
                <ImUserMinus />
              </div>
              <span className="font-semibold text-sm">Xóa thành viên</span>
            </div>
          </RenderIf>
          <RenderIf condition={member.user.id === session?.user.id}>
            <div
              className="py-3 px-2 flex gap-2 items-center rounded-md hover:bg-gray-100 hover:cursor-pointer w-full"
              onClick={handleLeftConversation}
            >
              <div className="p-1 rounded-full hover:cursor-pointer">
                <IoExitOutline />
              </div>
              <span className="font-semibold text-sm">Rời nhóm</span>
            </div>
          </RenderIf>
        </PopoverContent>
      </Popover>
    </div>
  );
}
