import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession(authOptions);
  console.log('session ===> ', session);

  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-screen">
      <div className="text-red-500 text-2xl flex flex-col gap-4">
        {session ? (
          <>
            <div>Вы вошли как: {session.user?.email}</div>
            <div className="flex gap-2">
              <Input type="text" placeholder="Enter text" value="Hello World" />
              <Button>Click me</Button>
            </div>
            <Link href="/about" className="text-blue-500 hover:underline">
              Перейти на страницу About
            </Link>
          </>
        ) : (
          <div>
            <div>Пожалуйста, войдите в систему</div>
            <Link href="/auth/signin" className="text-blue-500 hover:underline">
              Go to auth
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
