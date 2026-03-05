import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export default function CreateUserPage() {
  async function createUser(formData: FormData) {
    "use server";

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as any;

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    redirect("/admin/user");
  }

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold">Create User</h1>

      <form action={createUser} className="space-y-4">

        <input
          name="name"
          placeholder="Full Name"
          required
          className="w-full p-3 bg-white border border-gray-300 rounded text-black"
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="w-full p-3 bg-white border border-gray-300 rounded text-black"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          className="w-full p-3 bg-white border border-gray-300 rounded text-black"
        />

        <select
          name="role"
          className="w-full p-3 bg-white border border-gray-300 rounded text-black"
        >
          <option value="admin">Admin</option>
          <option value="editor">Editor</option>
          <option value="reporter">Reporter</option>
          <option value="advertiser">Advertiser</option>
          <option value="user">User</option>
        </select>

        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded text-white"
        >
          Create User
        </button>
      </form>
    </div>
  );
}