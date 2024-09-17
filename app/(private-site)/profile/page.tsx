import TabContainer from "@/app/components/pages/profile/TabContainer";
import { authOption } from "@/app/libs/authOptions";
import { GET_USER_BY_ID_ROUTE } from "@/app/shared/constants/ApiRoute";
import { getServerSession } from "next-auth";

const getUserData = async () => {
  const session = await getServerSession(authOption);
  if (session) {
    const res = await fetch(
      `${GET_USER_BY_ID_ROUTE}?id=${session.user.id}&getDetail=true`,
      {
        headers: {
          authorization: `Bearer ${session.accessToken}`,
        },
      }
    );
    if (!res.ok) {
      const { message } = await res.json();
      throw new Error(message);
    }
    return await res.json();
  }
  return null;
};

const Page = async () => {
  const user = await getUserData();
  if (user) return <TabContainer user={user} />;
  return <div></div>;
};

export default Page;
