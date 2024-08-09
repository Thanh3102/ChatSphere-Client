import NavbarItem from "./NavbarItem";
import UserAvatar from "./UserAvatar";

export default function Navbar() {
  return (
    <div className="flex flex-col w-12">
      <div className="flex-1">
        <NavbarItem />
      </div>
      <UserAvatar />
    </div>
  );
}
