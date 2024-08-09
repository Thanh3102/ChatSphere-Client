import Link from "next/link";

const ConservationPage = () => {
  return (  
    <div className="flex items-center justify-center h-full bg-white rounded-lg">
      <Link href="conversations/new">
        <span className="text-xl font-semibold">Bắt đầu cuộc trò chuyện mới</span>
      </Link>
    </div>
  );
};

export default ConservationPage;
