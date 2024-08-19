import { useAppDispatch, useAppSelector } from "@/app/libs/hooks";
import { getConversationInfo } from "@/app/shared/helpers/ConversationHelper";
import { Avatar } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa6";
import { useImmer } from "use-immer";
import ConversationInfo from "./ConversationInfo";
import ConversationSetting from "./ConversationSetting";
import ConversationFileSelect from "./ConversationFileSelect";
import { Fragment } from "react";

export default function ConversationDetail() {
  const { conversation } = useAppSelector((state) => state.conversation);
  const { data: session } = useSession();
  const [tabs, setTabs] = useImmer([
    {
      label: "Thông tin về đoạn chat",
      content: <ConversationInfo />,
      isOpen: false,
    },
    {
      label: "Tùy chỉnh đoạn chat",
      content: <ConversationSetting />,
      isOpen: false,
    },
    {
      label: "File phương tiện, File",
      content: <ConversationFileSelect />,
      isOpen: false,
    },
  ]);
  const info = getConversationInfo(conversation, session?.user.id);
  return (
    <Fragment>
      <div className="h-full overflow-y-auto flex-[0.5] bg-white rounded-lg px-2 min-w-0">
        <div className="py-10 flex justify-center items-center flex-col gap-4">
          <Avatar showFallback src={info.avatar ?? ""} className="scale-150" />
          <span className="font-semibold text-xl text-center mt-2">{info.name}</span>
        </div>
        <div className="mt-2">
          {tabs.map((tab, index) => (
            <div className="" key={`conversationInfoTab-${index}`}>
              <div
                className="py-3 px-2 flex justify-between items-center rounded-md hover:bg-gray-100 hover:cursor-pointer"
                onClick={() => {
                  setTabs((tabs) => {
                    tabs[index].isOpen = !tabs[index].isOpen;
                  });
                }}
              >
                <span className="text-base font-semibold">{tab.label}</span>
                {tab.isOpen ? <FaChevronDown /> : <FaChevronRight />}
              </div>
              {tab.isOpen && tab.content}
            </div>
          ))}
        </div>
      </div>
    </Fragment>
  );
}
