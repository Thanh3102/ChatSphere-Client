import { Button, Tooltip } from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaRegPlayCircle, FaRegStopCircle } from "react-icons/fa";
import { IoSend } from "react-icons/io5";

interface Props {
  stream: MediaStream | null | undefined;
  onClose: () => void;
}

export default function VoiceRecorder({ stream, onClose }: Props) {
  const [status, setStatus] = useState<"recording" | "finish" | "pending">(
    "pending"
  );
  const [recorder, setRecorder] = useState<MediaRecorder>();
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [isPlay, setIsPlay] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioElementRef = useRef<HTMLAudioElement>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  console.log("Recorder state:", recorder?.state);
  console.log("Total time:", totalTime);
  console.log("audioChunksRef:", audioChunksRef);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimer(timer + 1);
    }, 1000);

    if (recorder && recorder.state === "inactive") {
      clearInterval(timerInterval);
      setTotalTime(timer);
    }

    return () => {
      clearInterval(timerInterval);
    };
  }, [timer]);

  useEffect(() => {
    if (stream) {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = (e) => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });

        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);
      };

      mediaRecorder.start();

      if (audioElementRef.current) {
        audioElementRef.current.onended = () => {
          setIsPlay(false);
        };
      }

      setRecorder(mediaRecorder);
      setStatus("recording");

      return () => {
        onClose();
      };
    }
  }, []);

  const handleSendVoice = () => {
    setIsPlay(false);
    console.log("Send data", audioChunksRef);
    onClose();
  };

  const handleStop = () => {
    if (recorder) {
      if (status === "recording") {
        recorder.stop();
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }
        setStatus("finish");
      } else {
        audioElementRef.current?.pause();
        setIsPlay(false);
      }
    }
  };

  const handlePlay = () => {
    if (audioElementRef.current) {
      audioElementRef.current.src = audioUrl;
      audioElementRef.current.play().catch((error) => toast.error(error));
      setIsPlay(true);
    }
  };

  return (
    <div className="flex items-center gap-2 flex-1">
      <div className="bg-blue-500 flex-1 px-4 py-2 rounded-2xl flex items-center">
        {status === "recording" || isPlay ? (
          <Button isIconOnly onClick={handleStop}>
            <FaRegStopCircle />
          </Button>
        ) : (
          <Button isIconOnly>
            <FaRegPlayCircle onClick={handlePlay} />
          </Button>
        )}
        <div className="flex-1">
          <span>{status === "finish" ? "Đang record" : "Dừng record"}</span>
        </div>
        <span>Timer: {timer}</span>
        <audio ref={audioElementRef} className="hidden" />
      </div>
      {status === "finish" && (
        <Tooltip content="Nhấn để gửi" showArrow placement="top">
          <div
            className="mx-2 p-2 rounded-full hover:bg-gray-100 hover:cursor-pointer"
            onClick={handleSendVoice}
          >
            <IoSend className="text-xl text-blue-500" />
          </div>
        </Tooltip>
      )}
    </div>
  );
}
