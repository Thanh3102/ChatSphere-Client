interface Props {
  children: React.ReactNode;
}
export default function ProfileLayout({ children }: Props) {
  return (
    <div className="bg-gray-300 h-screen py-5">
      <div className="w-[1200px] h-full mx-auto">{children}</div>
    </div>
  );
}
