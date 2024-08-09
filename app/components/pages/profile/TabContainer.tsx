"use client";

import InfomationTab from "@/app/components/pages/profile/InfomationTab";
import { UserBasicInfo } from "@/app/shared/types/user";
import { Tab, Tabs } from "@nextui-org/react";

interface Props {
  user: UserBasicInfo;
}

const TabContainer = ({ user }: Props) => {
  let tabs = [
    {
      id: "infomation",
      label: "Thông tin cá nhân",
      content: <InfomationTab user={user} />,
    },
    {
      id: "security",
      label: "Bảo mật",
      content:
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    },
  ];
  return (
    <div className="bg-white rounded-xl h-full">
      <Tabs
        items={tabs}
        isVertical
        variant="underlined"
        size="lg"
        classNames={{
          base: "p-4",
          tabList:
            "gap-6 w-full relative rounded-none p-0 border-b border-divider",
          cursor: "w-full bg-[#22d3ee]",
          tab: "w-full px-0 h-12 justify-start",
          tabContent: "group-data-[selected=true]:text-[#06b6d4]",
          wrapper: "h-full",
          panel: "w-full",
        }}
      >
        {(item) => (
          <Tab key={item.id} title={item.label}>
            {item.content}
          </Tab>
        )}
      </Tabs>
    </div>
  );
};

export default TabContainer;
