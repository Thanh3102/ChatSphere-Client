import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Tooltip,
} from "@nextui-org/react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Fragment } from "react";
import { BiLogOut } from "react-icons/bi";
import { MdManageAccounts } from "react-icons/md";

const UserAvatar = () => {
  const { data: session } = useSession();

  return (
    <Fragment>
      <Tooltip
        content={session?.user.name}
        showArrow
        placement="right"
        offset={-1}
      >
        <div className="">
          <Dropdown>
            <DropdownTrigger>
              <Avatar src={session?.user.image ?? ""} />
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem
                startContent={<MdManageAccounts className="text-xl" />}
              >
                <Link href="/profile">Tài khoản</Link>
              </DropdownItem>
              <DropdownItem
                className="text-red-500"
                onClick={() => signOut()}
                startContent={<BiLogOut className="text-xl" />}
              >
                Đăng xuất
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </Tooltip>
    </Fragment>
  );
};

export default UserAvatar;
