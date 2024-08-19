"use client";
import { useEffect, useRef, useState } from "react";
//@ts-ignore
import { AudioVisualizer } from "react-audio-visualize";
import RenderIf from "@/app/components/ui/RenderIf";
import { DateToString } from "@/app/shared/helpers/DateFormat";
import { ConversationMessage } from "@/app/shared/types/conversation";
import { Spinner, Tooltip } from "@nextui-org/react";
import { IoPause, IoPlay } from "react-icons/io5";

interface Props {
  isCurrentUser: boolean;
  message: ConversationMessage;
}

type Status = "play" | "pause" | "idle";

const VoiceMessage = ({ message, isCurrentUser }: Props) => {
  const [blob, setBlob] = useState<Blob>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<Status>("idle");
  const [timer, setTimer] = useState<number>(0);
  const visualizerRef = useRef<HTMLCanvasElement>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioElementRef = useRef<HTMLAudioElement>(null);

  const fetchData = async () => {
    setIsLoading(true);
    const response = await fetch(message.fileURL);
    if (response.ok) {
      setBlob(await response.blob());
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (audioElementRef.current) {
      audioElementRef.current.onended = () => {
        setStatus("idle");
      };
    }
  }, [blob]);

  useEffect(() => {
    if (status === "play") {
      timerIntervalRef.current = setInterval(() => {
        setTimer((timer) => timer + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (status === "idle") setTimer(0);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [status]);

  useEffect(() => {
    if (timer === message.voiceDuration && timerIntervalRef.current) {
      setStatus("idle");
      clearInterval(timerIntervalRef.current);
    }
  }, [timer]);

  const formatTimer = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handlePlay = () => {
    if (audioElementRef.current) {
      audioElementRef.current.play();
      setStatus("play");
    }
  };

  const handlePause = () => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      setStatus("pause");
    }
  };

  return (
    <>
      <RenderIf condition={isLoading}>
        <Spinner />
      </RenderIf>
      <RenderIf condition={blob ? true : false && !isLoading}>
        <Tooltip
          content={DateToString(message.createdAt)}
          placement={isCurrentUser ? "left" : "right"}
          closeDelay={0}
        >
          <div className="bg-blue-500 p-3 rounded-2xl flex gap-4 items-center mt-2">
            <RenderIf condition={status !== "play"}>
              <div
                className="hover:cursor-pointer text-white"
                onClick={handlePlay}
              >
                <IoPlay />
              </div>
            </RenderIf>
            <RenderIf condition={status === "play"}>
              <div
                className="hover:cursor-pointer text-white"
                onClick={handlePause}
              >
                <IoPause />
              </div>
            </RenderIf>
            <AudioVisualizer
              ref={visualizerRef}
              blob={blob}
              width={140}
              height={50}
              barWidth={3}
              gap={3}
              barColor={status === "idle" ? "#FFFFFF" : "#738AFF"}
              barPlayedColor={"#FFFFFF"}
              currentTime={timer}
            />
            <span className="text-white text-sm font-semibold">
              {formatTimer(timer)}
            </span>
            <audio
              src={message.fileURL}
              className="hidden"
              ref={audioElementRef}
            />
          </div>
        </Tooltip>
      </RenderIf>
      {/* <RenderIf condition={!blob ? true : false && !isLoading}>
        <span className="italic text-gray-500 p-2 border-gray-500 border-1 rounded-lg">
          Không thể hiển thị nội dung
        </span>
      </RenderIf> */}
    </>
  );
};

export default VoiceMessage;
