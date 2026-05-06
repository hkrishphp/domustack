"use server";

import { redirect } from "next/navigation";
import { setAdminSession } from "@/lib/admin-auth";

export async function loginAction(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected) {
    return { error: "Admin password not configured on the server." };
  }
  if (password !== expected) {
    return { error: "Incorrect password." };
  }

  await setAdminSession(password);
  redirect("/admin");
}
