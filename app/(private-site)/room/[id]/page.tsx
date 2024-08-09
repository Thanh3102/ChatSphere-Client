"use client";
import { UserBasicInfo } from "@/app/shared/types/user";
import { getSocket } from "@/socket";
import { Button, Spinner, Tooltip } from "@nextui-org/react";
import { useSession } from "next-auth/react";
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

const VideoStream = ({
  data,
}: {
  data: { stream: MediaStream; user: UserBasicInfo };
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && data.stream) {
      videoRef.current.srcObject = data.stream;
      toast(`${data.user.name} đã tham gia phòng`);
    }
  }, []);

  return (
    <div className="">
      <video ref={videoRef} autoPlay playsInline width={400} height={400} />
      <p>User {data.user.name}</p>
    </div>
  );
};

interface Props {
  params: {
    id: string;
  };
}

const Page = ({ params: { id } }: Props) => {
  const [stream, setStream] = useState<MediaStream>();
  // const [streams, setStreams] = useState<
  //   { user: UserBasicInfo; stream: MediaStream }[]
  // >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOpenCamera, setIsOpenCamera] = useState<boolean>(true);
  const [isOpenVoice, setIsOpenVoice] = useState<boolean>(true);

  const { data: session, status } = useSession();
  const myVideoRef = useRef<HTMLVideoElement>(null);
  const socketRef = useRef<any>(null);
  const peersRef = useRef<{
    [key: string]: { user: UserBasicInfo; ref: Peer.Instance };
  }>({});

  const remoteStreamsRef = useRef<{
    [key: string]: { user: UserBasicInfo; stream: MediaStream };
  }>({});

  console.log("Peers", peersRef.current);
  // console.log("Streams", streams);
  console.log("Remote Streams", remoteStreamsRef);

  const gotStream = (stream: MediaStream) => {
    setStream(stream);

    if (!session) return;

    const handleOffer = (payload: {
      socketId: string;
      sender: UserBasicInfo;
      signal: SignalData;
    }) => {
      console.log(`[HandleOffer] Receive a offer from ${payload.sender.name}`);

      const { socketId, sender, signal } = payload;

      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream: stream,
      });

      peer.on("signal", (signal) => {
        console.log("[HandleOffer] Answer offer to " + sender.name);
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

      // peersRef.current[sender.id] = { user: sender, ref: peer };
    };

    const handleAnswer = (payload: {
      signal: SignalData;
      socketId: string;
      sender: UserBasicInfo;
    }) => {
      const { sender, signal } = payload;
      console.log(`[Answer Listener] Get answer from ${sender.name}`);

      console.log(
        "[Answer Listener] Update peer signal of ",
        peersRef.current[sender.id].user.name
      );
      console.log("[Answer Listener] Peer info:", peersRef.current[sender.id]);
      console.log("[Answer Listener] Signal to update", signal);
      peersRef.current[sender.id].ref.signal(signal);
    };

    const handleUserJoined = (payload: {
      socketId: string;
      user: UserBasicInfo;
    }) => {
      const { socketId, user } = payload;
      console.log(`[Handle User Joined] ${user.name} join room`);

      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream: stream,
      });

      peer.on("signal", (signal) => {
        console.log(`[Handle User Joined] Send offer to ${user.name}`);
        socketRef.current.emit("offer", {
          socketId: socketId,
          signal: signal,
        });
      });

      peer.on("stream", (stream) => {
        console.log("[Handle User join] Get stream from " + user.name);
        // setStreams((streams) => [...streams, { user: user, stream: stream }]);
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

    const handleUserLeft = (payload: { user: UserBasicInfo }) => {
      const { user } = payload;
      console.log(`[User Left] ${payload.user.name} đã rời phòng`);
      if (peersRef.current[user.id]) {
        peersRef.current[user.id].ref.destroy();
        delete peersRef.current[user.id];
      }

      if (remoteStreamsRef.current[user.id]) {
        delete remoteStreamsRef.current[user.id];
      }

      toast(`${payload.user.name} đã rời khỏi phòng`, {
        position: "top-center",
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
    <Fragment>
      {isLoading ? (
        <Spinner />
      ) : (
        <Fragment>
          <div className="">
            <p>Other people</p>
            <div className="flex flex-wrap gap-4">
              {/* {streams.map((stream, index) => (
                <VideoStream data={stream} key={index} />
              ))} */}
              {Object.keys(remoteStreamsRef.current).map((key) => (
                <VideoStream data={remoteStreamsRef.current[key]} key={key} />
              ))}
            </div>
          </div>
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
        </Fragment>
      )}
    </Fragment>
  );
};

export default Page;
