"use client";
import { useReactMediaRecorder } from "react-media-recorder-2";
import { SEND_VOICE_CLIP_ROUTE } from "@/app/shared/constants/ApiRoute";
import { Tooltip } from "@nextui-org/react";
import { getSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaPause, FaPlay } from "react-icons/fa6";
import { IoSend } from "react-icons/io5";

interface Props {
  stream: MediaStream | null | undefined;
  conversationId?: string;
  onClose: () => void;
  createConversation: () => Promise<{
    id: string;
  }>;
}

type AudioStatus = "play" | "pause" | "inactive";

export default function VoiceRecorder({
  stream,
  conversationId,
  onClose,
  createConversation,
}: Props) {
  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({
      audio: true,
      customMediaStream: stream,
      onStart() {},
      onStop(blobUrl, blob) {
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        setAudioBlob(blob);
        setIsFinishRecording(true);
      },
    });
  const [isFinishRecording, setIsFinishRecording] = useState<boolean>(false);
  const [audioStatus, setAudioStatus] = useState<AudioStatus>("inactive");
  const [timer, setTimer] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);
  const [audioBlob, setAudioBlob] = useState<Blob>();
  const audioElementRef = useRef<HTMLAudioElement>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const countDownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    startRecording();
    if (audioElementRef.current) {
      audioElementRef.current.onended = () => {
        setAudioStatus("inactive");
      };
    }
  }, []);

  useEffect(() => {
    if (status === "recording") {
      timerIntervalRef.current = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [status]);

  useEffect(() => {
    if (audioStatus === "play") {
      countDownIntervalRef.current = setInterval(() => {
        setTimer((timer) => timer - 1);
      }, 1000);
    } else {
      if (countDownIntervalRef.current)
        clearInterval(countDownIntervalRef.current);
    }

    return () => {
      if (countDownIntervalRef.current)
        clearInterval(countDownIntervalRef.current);
    };
  }, [audioStatus]);

  useEffect(() => {
    if (timer >= 30 * 60) {
      stopRecording();
      toast.error(
        "Clip âm thanh dài tối đa 30 phút. Vui lòng tạo clip âm thanh mới"
      );
    }

    if (timer === 0) {
      if (countDownIntervalRef.current)
        clearInterval(countDownIntervalRef.current);
      setTimer(totalTime);
    }
  }, [timer]);

  const handleSendVoice = async (id: string | undefined) => {
    handleStop();
    onClose();

    const session = await getSession();
    const formData = new FormData();

    if (!id) {
      const { id } = await createConversation();
      conversationId = id;
      formData.append("conversationId", conversationId);
    } else {
      formData.append("conversationId", id);
    }

    if (audioBlob) formData.append("audio", audioBlob);
    formData.append("duration", totalTime.toString());

    await fetch(SEND_VOICE_CLIP_ROUTE, {
      method: "POST",
      headers: {
        authorization: `Bearer ${session?.accessToken}`,
      },
      body: formData,
    });
  };

  const handleStop = () => {
    if (!isFinishRecording) {
      setTotalTime(timer);
      stopRecording();
    } else {
      if (audioStatus === "play") {
        audioElementRef.current?.pause();
        setAudioStatus("pause");
      }
    }
  };

  const handlePlay = () => {
    if (audioElementRef.current) {
      audioElementRef.current.play();
      setAudioStatus("play");
    }
  };

  const handleSendClick = () =>
    toast.promise(
      handleSendVoice(conversationId),
      {
        loading: "Đang gửi clip âm thanh",
        error: "Đã xảy ra lỗi khi gửi clip âm thanh",
        success: "Gửi thành công",
      },
      { position: "bottom-right" }
    );

  const formatTimer = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center gap-2 flex-1">
      <div className="bg-blue-500 flex-1 p-2 rounded-full flex items-center justify-between">
        <div
          className="p-1 bg-white hover:cursor-pointer rounded-full flex items-center justify-center text-blue-500"
          onClick={
            status === "recording" || audioStatus == "play"
              ? handleStop
              : handlePlay
          }
        >
          {status === "recording" || audioStatus == "play" ? (
            <FaPause />
          ) : (
            <FaPlay />
          )}
        </div>

        <span className="px-2 py-1 bg-white text-blue-500 rounded-full text-sm">
          {formatTimer(timer)}
        </span>
        <audio ref={audioElementRef} className="hidden" src={mediaBlobUrl} />
      </div>
      <Tooltip content="Nhấn để gửi" showArrow placement="top">
        <div
          className={`mx-2 p-2 rounded-full hover:bg-gray-100 hover:cursor-pointer ${
            isFinishRecording ? "visible" : "invisible"
          }`}
          onClick={handleSendClick}
        >
          <IoSend className="text-xl text-blue-500" />
        </div>
      </Tooltip>
    </div>
  );
}
