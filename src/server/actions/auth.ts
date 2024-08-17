"use server";

import { revalidatePath } from "next/cache";
import { api } from "~/trpc/server";

export const loginAction = async () => {
  await api.auth.login({
    secretId: "id",
    secretKey: "key",
  });

  revalidatePath("/");
};

export const logoutAction = async () => {
  await api.auth.logout();
  revalidatePath("/");
};
