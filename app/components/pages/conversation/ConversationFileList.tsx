import { Tab, Tabs } from "@nextui-org/react";

export default function ConversationFileList() {
  return (
    <div className="">
      <Tabs fullWidth classNames={{}}>
        <Tab key="File phương tiện" title="File phương tiện">
          <span className="">Tab 1</span>
        </Tab>
        <Tab key="File" title="File">
          <div className="">Tab 2</div>
        </Tab>
      </Tabs>
    </div>
  );
}
