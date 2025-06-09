import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-4">Личный кабинет</h1>
          
          <div className="mb-6 p-4 bg-gray-50 rounded-md">
            <h2 className="text-lg font-semibold mb-2">Информация о пользователе</h2>
            <p><strong>ID:</strong> {user?.id}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Имя:</strong> {user?.name || "Не указано"}</p>
          </div>

          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <Button type="submit" variant="destructive">
              Выйти из аккаунта
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
} 