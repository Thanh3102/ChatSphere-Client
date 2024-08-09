"use client";
import { useAppDispatch } from "@/app/libs/hooks";
import { changeSelect } from "@/app/libs/redux/slices/AppSlice";
import { Tooltip } from "@nextui-org/react";
import { ReactNode, useState } from "react";
import { AiFillMessage } from "react-icons/ai";
import { FaBoxArchive } from "react-icons/fa6";
import { IoChatbubbleSharp, IoPeopleSharp } from "react-icons/io5";

const items: { title: string; icon: ReactNode }[] = [
  {
    title: "Đoạn chat",
    icon: <IoChatbubbleSharp />,
  },
  {
    title: "Mọi người",
    icon: <IoPeopleSharp />,
  },
  {
    title: "Yêu cầu",
    icon: <AiFillMessage />,
  },
  {
    title: "Lưu trữ",
    icon: <FaBoxArchive />,
  },
];

export default function NavbarItem() {
  const [active, setActive] = useState<number>(0);
  const dispatch = useAppDispatch();
  return (
    <ul>
      {items.map((item, index) => (
        <Tooltip content={item.title} key={index} placement="right" showArrow>
          <li
            className={`flex gap-4 items-center text-base p-3 rounded-md hover:bg-gray-300 hover:cursor-pointer ${
              index === active ? "bg-gray-300 text-black" : "text-gray-500"
            }`}
            onClick={() => {
              setActive(index);
              dispatch(changeSelect(item.title));
            }}
          >
            <div className="text-xl">{item.icon}</div>
            {/* <span className="font-semibold text-sm">{item.title}</span> */}
          </li>
        </Tooltip>
      ))}
    </ul>
  );
}
