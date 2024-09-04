import { UserBasicInfo } from "@/app/shared/types/user";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

interface Props {
  stream: MediaStream;
  user: UserBasicInfo;
}

export default function VideoStream({ stream, user }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      toast(`${user.name} đã tham gia phòng`);
    }
  }, []);

  return (
    <div className="block relative w-full h-full">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      />
      <p className="z-50 absolute bottom-0 left-0 bg-slate-500 text-white p-1 text-sm">
        {user.name}
      </p>
    </div>
  );
}
