import { useAppDispatch, useAppSelector } from "@/app/libs/hooks";
import { setOpenPinMessage } from "@/app/libs/redux/slices/ConversationSlice";

import { Fragment } from "react";
import { MdPushPin } from "react-icons/md";

export default function ConversationInfo() {
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(setOpenPinMessage(true));
  };

  return (
    <Fragment>
      <div
        className="px-2 py-3 rounded-lg hover:bg-gray-100 hover:cursor-pointer font-semibold"
        onClick={handleClick}
      >
        <div className="flex gap-2 items-center">
          <div className="p-2 bg-gray-300 rounded-full">
            <MdPushPin />
          </div>
          <span>Xem tin nhắn đã ghim</span>
        </div>
      </div>
    </Fragment>
  );
}
