import { redirect } from "next/navigation";

export default async function Home() {
  redirect("/conversations");
  return <main className=""></main>;
}
