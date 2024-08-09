"use client";
import { useAppSelector } from "@/app/libs/hooks";
import ContentDisplay from "./ContentDisplay";

export default function ContentBox() {
  const select = useAppSelector((state) => state.app.contentBoxSelect);
  return (
    <div className="bg-white rounded-md h-full p-3 flex-1 min-w-0">
      <ContentDisplay selectContent={select} />
    </div>
  );
}
