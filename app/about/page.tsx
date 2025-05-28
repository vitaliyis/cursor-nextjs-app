import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function AboutPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="mt-10 p-6">
      <h1 className="text-2xl font-bold mb-4">О нас</h1>
      <div className="prose">
        <p>Это защищенная страница. Вы видите её потому что вы авторизованы как: {session.user?.email}</p>
      </div>
    </div>
  );
} 