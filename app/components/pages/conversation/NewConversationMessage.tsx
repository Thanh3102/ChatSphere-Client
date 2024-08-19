"use client";
import { Fragment } from "react";
import SendMessageBox from "./ConversationSendMsgBox";
import { Avatar, AvatarGroup } from "@nextui-org/react";
import { useAppSelector } from "@/app/libs/hooks";
import { FaRegUser } from "react-icons/fa6";
import { UserBasicInfo } from "@/app/shared/types/user";
import RenderIf from "../../ui/RenderIf";

export default function NewConversationMessage() {
  const { members } = useAppSelector((state) => state.newConversation);

  const joinName = (members: UserBasicInfo[]) => {
    let str = "";
    members.forEach((member, index) => {
      index === 0 ? (str = member.name) : (str += `, ${member.name}`);
    });
    return str;
  };

  if (members.length !== 0) {
    return (
      <Fragment>
        <div className="flex-grow-[1] flex flex-col">
          <div className="flex flex-col items-center flex-1 mt-8">
            <RenderIf condition={members.length > 1}>
              <AvatarGroup max={2} total={members.length - 2}>
                {members.map((member) => (
                  <Avatar
                    name={member.name}
                    key={member.id}
                    showFallback
                    fallback={<FaRegUser className="text-xl" />}
                    src=""
                  />
                ))}
              </AvatarGroup>
            </RenderIf>
            <RenderIf condition={members.length === 1}>
              <Avatar
                name={members[0].name}
                key={members[0].id}
                showFallback
                fallback={<FaRegUser className="text-xl" />}
                src=""
              />
            </RenderIf>

            <span>{joinName(members)}</span>
          </div>
        </div>
        <SendMessageBox />
      </Fragment>
    );
  }

  return (
    <Fragment>
      <div className="flex-1"></div>
    </Fragment>
  );
}
