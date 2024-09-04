"use client";

import InfomationTab from "@/app/components/pages/profile/InfomationTab";
import { UserDetailInfo } from "@/app/shared/types/user";
import { Tab, Tabs } from "@nextui-org/react";
import ChangePasswordForm from "../../forms/ChangePasswordForm";

interface Props {
  user: UserDetailInfo;
}

const TabContainer = ({ user }: Props) => {
  let tabs = [
    {
      id: "userInfomation",
      label: "Thông tin cá nhân",
      content: <InfomationTab user={user} />,
    },
    {
      id: "userSecurity",
      label: "Đổi mật khẩu",
      content: <ChangePasswordForm />,
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
