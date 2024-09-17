import { useAppDispatch } from "@/app/libs/hooks";
import { setReplyMessage } from "@/app/libs/redux/slices/ConversationSlice";
import { ConversationMessage } from "@/app/shared/types/conversation";
import { IoMdClose } from "react-icons/io";

interface Props {
  message: ConversationMessage;
  userId: string | undefined;
}
const ReplyMessage = ({ message, userId }: Props) => {
  const dispatch = useAppDispatch();
  return (
    <div className="px-5 py-2 border-t-1 border-gray-300 flex items-center">
      <div className="flex flex-col flex-1 min-w-0">
        <span className="text-sm font-semibold">
          Đang trả lời{" "}
          {message.sender.id === userId ? "chính mình" : message.sender.name}
        </span>
        <span className="text-xs text-ellipsis block whitespace-nowrap w-full overflow-hidden">
          {message.type === "text" ? message.body : "File đính kèm"}
        </span>
      </div>
      <div
        className="p-1 rounded-full hover:bg-gray-100 hover:cursor-pointer"
        onClick={() => dispatch(setReplyMessage(null))}
      >
        <IoMdClose />
      </div>
    </div>
  );
};

export default ReplyMessage;
