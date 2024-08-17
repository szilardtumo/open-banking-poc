import { TRPCError } from "@trpc/server";
import NordigenClient from "nordigen-node";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

interface GoCardlessNewTokenResponse {
  access: string;
  access_expires: number;
}

export const authRouter = createTRPCRouter({
  login: publicProcedure
    .input(z.object({ secretId: z.string(), secretKey: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const client = new NordigenClient({
        secretId: input.secretId,
        secretKey: input.secretKey,
        baseUrl: "https://bankaccountdata.gocardless.com/api/v2",
      });

      try {
        const data =
          (await client.generateToken()) as GoCardlessNewTokenResponse;

        ctx.session.accessToken = data.access;
        ctx.session.updateConfig({
          ...ctx.sessionOptions,
          cookieOptions: { maxAge: data.access_expires },
        });
        await ctx.session.save();
      } catch (error) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid credentials!",
        });
      }
    }),
  logout: publicProcedure.mutation(async ({ ctx }) => {
    ctx.session.destroy();
  }),
  getIsLoggedIn: publicProcedure.query(async ({ ctx }) => {
    return !!ctx.session.accessToken;
  }),
});
