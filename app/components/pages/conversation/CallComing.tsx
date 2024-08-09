import { getSocket } from "@/socket";
import { Button } from "@nextui-org/react";

interface Props {
  type: "video" | "voice";
  from: {
    name: string;
    avatar: string;
  };
  room: string;
  close: () => void;
}
const CallComing = ({ close, room, type }: Props) => {
  const acceptCall = async () => {
    const socket = getSocket();

    // socket.emit("acceptCall", () => {
    // Xử lý đồng ý
    // });

    close();
    const url = `${process.env.NEXT_PUBLIC_CLIENT_BASE_URL}/room/${room}?type=${type}`;
    window.open(url, "_blank");
  };
  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] z-20">
      <div className="flex flex-col justify-center bg-white rounded-lg p-4">
        <span>Bạn nhận được cuộc gọi từ USERNAME</span>
        <div className="mt-4 flex items-center gap-4 justify-center">
          <Button color="danger" onClick={() => close()}>
            Từ chối
          </Button>
          <Button color="success" className="text-white" onClick={acceptCall}>
            Chấp nhận
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CallComing;
