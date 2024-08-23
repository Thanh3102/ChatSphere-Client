import { ConversationMember } from "@/app/shared/types/conversation";
import { Button } from "@nextui-org/react";
import RenderIf from "../../ui/RenderIf";
import ConversationMemberItem from "./ConversationMemberItem";
import { IoMdPersonAdd } from "react-icons/io";
import { useAppDispatch } from "@/app/libs/hooks";
import { setOpenAddMember } from "@/app/libs/redux/slices/ConversationSlice";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface Props {
  members: ConversationMember[];
  showAddMember?: boolean;
}

export default function ConversationMembers({
  members,
  showAddMember = false,
}: Props) {
  const [role, setRole] = useState<string>("member");

  const dispatch = useAppDispatch();

  const handleAddMemberClick = () => {
    dispatch(setOpenAddMember(true));
  };

  const getCurrentUserRole = async () => {
    const session = await getSession();
    const currentUser = members.find(
      (member) => member.user.id === session?.user.id
    );
    if (currentUser?.role) {
      setRole(currentUser?.role);
    }
  };

  useEffect(() => {
    getCurrentUserRole();
  }, []);

  return (
    <>
      {members.map((member) => (
        <ConversationMemberItem
          member={member}
          key={member.id}
          currentUserRole={role}
        />
      ))}
      <RenderIf condition={showAddMember}>
        <div
          className="p-2 rounded-xl hover:bg-gray-100 hover:cursor-pointer flex items-center gap-2"
          onClick={handleAddMemberClick}
        >
          <div className="p-2 bg-gray-200 rounded-full">
            <IoMdPersonAdd />
          </div>
          <span className="font-semibold">Thêm người</span>
        </div>
      </RenderIf>
    </>
  );
}
