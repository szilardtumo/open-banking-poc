"use server";

import { revalidatePath } from "next/cache";
import { api } from "~/trpc/server";

export const loginAction = async (
  data: Parameters<typeof api.auth.login>[0],
) => {
  await api.auth.login(data);

  revalidatePath("/");
};

export const logoutAction = async () => {
  await api.auth.logout();
  revalidatePath("/");
};
