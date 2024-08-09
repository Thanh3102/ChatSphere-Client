"use client";
import { ScrollShadow } from "@nextui-org/react";
import UserSearchItem from "./UserSearchItem";
import { UserBasicInfo } from "@/app/shared/types/user";

interface Props {
  users: UserBasicInfo[];
}

export default function UserSearchResult({ users }: Props) {
  return (
    <div className="absolute z-10 w-80 h-96 bg-white shadow-large rounded-md top-8 p-4 hidden peer-focus/usersearch:flex flex-col">
      <ScrollShadow className="flex-1">
        {users.map((user) => (
          <UserSearchItem user={user} key={user.id} />
        ))}
      </ScrollShadow>
    </div>
  );
}
