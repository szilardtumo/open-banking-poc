import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const authRouter = createTRPCRouter({
  login: publicProcedure
    .input(z.object({ secretId: z.string(), secretKey: z.string() }))
    .mutation(async ({ input, ctx }) => {
      ctx.session.accessToken = input.secretId;
      await ctx.session.save();
    }),
  logout: publicProcedure.mutation(async ({ ctx }) => {
    ctx.session.destroy();
  }),
  getIsLoggedIn: publicProcedure.query(async ({ ctx }) => {
    return !!ctx.session.accessToken;
  }),
});
