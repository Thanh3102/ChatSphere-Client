import { FaFacebook, FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

const SocialSignup = () => {
  return (
    <div className="mt-10">
      <p className="text-sm">Hoặc đăng ký với</p>
      <div className="flex gap-4 -mx-1 mt-2">
        <button className="border-2 border-gray-400 rounded-full w-1/3 px-1 py-2 flex gap-2 items-center justify-center hover:bg-slate-200">
          <FaFacebook className="text-blue-600" />
          <span className="text-sm">Facebook</span>
        </button>
        <button className="border-2 border-gray-400 rounded-full w-1/3 px-1 py-2 flex gap-2 items-center justify-center hover:bg-slate-200">
          <FcGoogle />
          <span className="text-sm">Google</span>
        </button>
        <button className="border-2 border-gray-400 rounded-full w-1/3 px-1 py-2 flex gap-2 items-center justify-center hover:bg-slate-200">
          <FaGithub />
          <span className="text-sm">Github</span>
        </button>
      </div>
    </div>
  );
};

export default SocialSignup;
