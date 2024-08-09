"use client";
import { useAppDispatch, useAppSelector } from "@/app/libs/hooks";
import { addMember } from "@/app/libs/redux/slices/NewConversationSlice";
import { setKeyword } from "@/app/libs/redux/slices/UserSearchSlice";
import { UserBasicInfo } from "@/app/shared/types/user";
import { Avatar } from "@nextui-org/react";
import { FaUser } from "react-icons/fa6";

interface UserSearchItemProps {
  user: UserBasicInfo;
}

export default function UserSearchItem({ user }: UserSearchItemProps) {
  const dispatch = useAppDispatch();
  const setFocus = () => {
    if (document) {
      const element = document.getElementById("newConversationSearchInput");
      element?.focus();
    }
  };
  return (
    <div
      className="flex gap-3 items-center hover:bg-gray-100 px-2 rounded-md hover:cursor-pointer"
      onMouseDown={() => {
        dispatch(addMember(user));
        dispatch(setKeyword(""));
        setTimeout(() => {
          setFocus();
        }, 100);
      }}
    >
      <Avatar
        name={user.name}
        showFallback
        fallback={<FaUser className="text-xl" />}
        radius="full"
        src={user.image}
        className="my-2"
      />
      {user.name}
    </div>
  );
}
