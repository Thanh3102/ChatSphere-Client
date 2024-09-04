"use client";
import VideoStream from "@/app/components/pages/room/VideoStream";
import VideoStreamContainer from "@/app/components/pages/room/VideoStreamContainer";
import RenderIf from "@/app/components/ui/RenderIf";
import { UserBasicInfo } from "@/app/shared/types/user";
import { getSocket } from "@/socket";
import { Button, Spinner, Tooltip } from "@nextui-org/react";
import { getSession, useSession } from "next-auth/react";
import { Fragment, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  BsCameraVideo,
  BsCameraVideoOff,
  BsMic,
  BsMicMute,
} from "react-icons/bs";
import { IoMdExit } from "react-icons/io";
import Peer, { SignalData } from "simple-peer";

interface Props {
  params: {
    id: string;
  };
}

type OfferPayload = {
  socketId: string;
  sender: UserBasicInfo;
  signal: SignalData;
};

type AnswerPayload = {
  signal: SignalData;
  socketId: string;
  sender: UserBasicInfo;
};

type UserJoinedPayload = {
  socketId: string;
  user: UserBasicInfo;
};

type UserLeftPayload = { user: UserBasicInfo };

const Page = ({ params: { id } }: Props) => {
  const { status } = useSession();
  const [stream, setStream] = useState<MediaStream>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOpenCamera, setIsOpenCamera] = useState<boolean>(true);
  const [isOpenVoice, setIsOpenVoice] = useState<boolean>(true);
  const myVideoRef = useRef<HTMLVideoElement>(null);
  const socketRef = useRef<any>(null);

  const peersRef = useRef<
    Record<string, { user: UserBasicInfo; ref: Peer.Instance }>
  >({});

  const remoteStreamsRef = useRef<
    Record<string, { user: UserBasicInfo; stream: MediaStream }>
  >({});

  const gotStream = async (stream: MediaStream) => {
    setStream(stream);

    const session = await getSession();
    if (!session) return;

    const handleOffer = (payload: OfferPayload) => {
      const { socketId, sender, signal } = payload;

      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream: stream,
      });

      peer.on("signal", (signal) => {
        socketRef.current.emit("answer", {
          socketId: socketId,
          signal: signal,
        });
      });

      peer.on("close", () => {
        if (remoteStreamsRef.current[payload.sender.id]) {
          delete remoteStreamsRef.current[payload.sender.id];
        }
      });

      peer.on("error", (err) => {
        console.log("[Peer Error] Message:", err);
      });

      peer.on("stream", (stream) => {
        console.log("[HandleOffer] Get stream from " + sender.name);
        remoteStreamsRef.current[payload.sender.id] = {
          user: sender,
          stream: stream,
        };
      });

      peer.signal(signal);
    };

    const handleAnswer = (payload: AnswerPayload) => {
      const { sender, signal } = payload;
      peersRef.current[sender.id].ref.signal(signal);
    };

    const handleUserJoined = (payload: UserJoinedPayload) => {
      const { socketId, user } = payload;

      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream: stream,
      });

      peer.on("signal", (signal) => {
        socketRef.current.emit("offer", {
          socketId: socketId,
          signal: signal,
        });
      });

      peer.on("stream", (stream) => {
        remoteStreamsRef.current[payload.user.id] = {
          user: user,
          stream: stream,
        };
      });

      peer.on("error", (err) => {
        console.log("[Peer Error] Message:", err);
      });

      peersRef.current[user.id] = { user: user, ref: peer };
    };

    const handleUserLeft = (payload: UserLeftPayload) => {
      const { user } = payload;
      if (peersRef.current[user.id]) {
        peersRef.current[user.id].ref.destroy();
        delete peersRef.current[user.id];
      }

      if (remoteStreamsRef.current[user.id]) {
        delete remoteStreamsRef.current[user.id];
      }

      toast(`${payload.user.name} đã rời khỏi phòng`, {
        position: "bottom-right",
      });
    };

    socketRef.current = getSocket();

    socketRef.current.on("userJoined", handleUserJoined);

    socketRef.current.on("userLeft", handleUserLeft);

    socketRef.current.on("offer", handleOffer);

    socketRef.current.on("answer", handleAnswer);

    if (myVideoRef.current) {
      myVideoRef.current.srcObject = stream;
      socketRef.current.emit("joinRoom", {
        roomId: id,
        userId: session.user.id,
      });
    }
  };

  const handleCamera = () => {
    if (stream) {
      const videoTracks = stream.getVideoTracks();
      if (isOpenCamera) {
        videoTracks.forEach((track) => (track.enabled = false));
        setIsOpenCamera(false);
      } else {
        videoTracks.forEach((track) => (track.enabled = true));
        setIsOpenCamera(true);
      }
    }
  };

  const handleVoice = () => {
    if (stream) {
      const audioTracks = stream.getAudioTracks();
      if (isOpenVoice) {
        audioTracks.forEach((track) => (track.enabled = false));
        setIsOpenVoice(false);
      } else {
        audioTracks.forEach((track) => (track.enabled = true));
        setIsOpenVoice(true);
      }
    }
  };

  const handleBeforeUnload = () => {
    socketRef.current.emit("leftRoom");
    for (const key in peersRef.current) {
      peersRef.current[key].ref.destroy();
    }
  };



  useEffect(() => {
    if (status === "authenticated") {
      setIsLoading(false);

      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then(gotStream);

      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        socketRef.current.off("userJoined");
        socketRef.current.off("userLeft");
        socketRef.current.off("offer");
        socketRef.current.off("answer");

        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  }, [status]);

  useEffect(() => {}, [remoteStreamsRef.current]);

  return (
    <div className="h-screen">
      <RenderIf condition={isLoading}>
        <Spinner />
      </RenderIf>

      <RenderIf condition={!isLoading}>
        <RenderIf
          condition={Object.keys(remoteStreamsRef.current).length !== 0}
        >
          <VideoStreamContainer data={remoteStreamsRef.current}/>
        </RenderIf>

        <RenderIf condition={Object.keys(remoteStreamsRef.current).length == 0}>
          <Spinner />
          <span>Đang chờ</span>
        </RenderIf>

        <div className="absolute bottom-0 right-0">
          <video
            ref={myVideoRef}
            autoPlay
            playsInline
            muted
            width={200}
            height={200}
          />
        </div>
        <div className="absolute bottom-20 w-full items-center z-10">
          <div className="gap-8 flex justify-center items-center">
            <Tooltip placement="top" content="Bật/Tắt camera" showArrow>
              <Button isIconOnly onClick={handleCamera} size="lg">
                {isOpenCamera ? <BsCameraVideo /> : <BsCameraVideoOff />}
              </Button>
            </Tooltip>
            <Tooltip placement="top" content="Bật/Tắt micro" showArrow>
              <Button isIconOnly onClick={handleVoice} size="lg">
                {isOpenVoice ? <BsMic /> : <BsMicMute />}
              </Button>
            </Tooltip>
            <Tooltip placement="top" content="Rời khỏi phòng" showArrow>
              <Button
                isIconOnly
                onClick={() => window.close()}
                color="danger"
                size="lg"
              >
                <IoMdExit />
              </Button>
            </Tooltip>
          </div>
        </div>
      </RenderIf>
    </div>
  );
};

export default Page;
