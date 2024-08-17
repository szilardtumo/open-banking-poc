import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

import NordigenClient from "nordigen-node";
import { z } from "zod";

type GetInstitutionsResponse = {
  id: string;
  name: string;
  bic: string;
  transaction_total_days: string;
  countries: string[];
}[];

interface GetRequisitionsResponse {
  results: unknown[];
  count: number;
}

export const goCardlessRouter = createTRPCRouter({
  getInstitutions: protectedProcedure
    .input(z.object({ country: z.string() }))
    .query(async ({ input, ctx }) => {
      const client = new NordigenClient({
        secretId: "",
        secretKey: "",
        baseUrl: "https://bankaccountdata.gocardless.com/api/v2",
      });
      client.token = ctx.session.accessToken;

      const data = (await client.institution.getInstitutions(
        input,
      )) as GetInstitutionsResponse;

      return data;
    }),
  getRequisitions: protectedProcedure.query(async ({ ctx }) => {
    const client = new NordigenClient({
      secretId: "",
      secretKey: "",
      baseUrl: "https://bankaccountdata.gocardless.com/api/v2",
    });
    client.token = ctx.session.accessToken;

    const data =
      (await client.requisition.getRequisitions()) as GetRequisitionsResponse;

    return data;
  }),
});
