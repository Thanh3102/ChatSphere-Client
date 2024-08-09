"use client";
import { ChangeEvent, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/app/libs/hooks";
import UserSearchResult from "./UserSearchResult";
import { SEARCH_USER_BY_NAME_ROUTE } from "@/app/shared/constants/ApiRoute";
import { useSession } from "next-auth/react";
import { IoClose } from "react-icons/io5";
import { setKeyword, setResult } from "@/app/libs/redux/slices/UserSearchSlice";
import { removeMember } from "@/app/libs/redux/slices/NewConversationSlice";

export default function UserSearch() {
  const { data: session } = useSession();
  const { members } = useAppSelector((state) => state.newConversation);
  const { searchUserKeyword, searchUserResult } = useAppSelector(
    (state) => state.userSearch
  );
  const dispatch = useAppDispatch();

  const handleSearchChange = async (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setKeyword(e.target.value));
  };

  const getUsers = async (keyword: string) => {
    if (!session?.accessToken) {
      return [];
    }

    let exitstUser: string = "";

    members.forEach((member) => (exitstUser += `&skipId=${member.id}`));
    const response = await fetch(
      `${SEARCH_USER_BY_NAME_ROUTE}?name=${keyword}${exitstUser}`,
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
      dispatch(setResult(users));
    } else {
      dispatch(setResult([]));
    }
  };

  useEffect(() => {
    getUsers(searchUserKeyword);
  }, [searchUserKeyword]);

  return (
    <div className="w-full">
      <div className="p-4 flex shadow-md">
        <span className="">Đến:</span>
        <div className="flex flex-1 flex-wrap ">
          <div className="flex flex-wrap -mt-1">
            {members.map((member) => (
              <div
                className="bg-gray-100 font-medium rounded-md h-fit py-1 px-2 mx-1 text-sm flex gap-2 items-center mt-1"
                key={member.id}
              >
                {member.name}
                <div
                  className="p-1 rounded-full hover:bg-gray-200"
                  onClick={() => dispatch(removeMember(member))}
                >
                  <IoClose />
                </div>
              </div>
            ))}
          </div>
          <div className="relative flex-1 flex">
            <input
              id="newConversationSearchInput"
              type="text"
              className="flex-1 outline-none relative peer/usersearch"
              value={searchUserKeyword}
              onChange={handleSearchChange}
            />
            <UserSearchResult users={searchUserResult} />
          </div>
        </div>
      </div>
    </div>
  );
}
