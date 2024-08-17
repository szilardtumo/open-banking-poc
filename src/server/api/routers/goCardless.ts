import {
  createTRPCMiddleware,
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

import NordigenClient from "nordigen-node";
import { z } from "zod";
import { env } from "~/env";

export interface RequisitionResponse {
  id: string;
  institution_id: string;
  link: string;
  redirect: string;
  accounts: string[];
  status: string;
}

type GetInstitutionsResponse = {
  id: string;
  name: string;
  bic: string;
  transaction_total_days: string;
  countries: string[];
}[];

interface GetRequisitionsResponse {
  results: RequisitionResponse[];
  count: number;
}

interface GetAccountBalancesResponse {
  balances: { balanceAmount: { amount: string; currency: string } }[];
}

interface GetAccountMetadataResponse {
  id: string;
  iban: string;
  status: string;
  owner_name: string;
  institution_id: string;
}

interface TransactionResponse {
  transactionId: string;
  bookingDateTime: string;
  transactionAmount: {
    amount: string;
    currency: string;
  };
  debtorName?: string;
  creditorName?: string;
  remittanceInformationUnstructured?: string;
  remittanceInformationUnstructuredArray?: string[];
}

interface GetAccountTransactionsResponse {
  transactions: {
    booked: TransactionResponse[];
    pending: TransactionResponse[];
  };
}

const goCardlessClientMiddleware = createTRPCMiddleware(({ ctx, next }) => {
  const goCardlessClient = new NordigenClient({
    secretId: "",
    secretKey: "",
    baseUrl: "https://bankaccountdata.gocardless.com/api/v2",
  });
  goCardlessClient.token = ctx.session.accessToken;
  return next({ ctx: { ...ctx, goCardlessClient } });
});

export const goCardlessRouter = createTRPCRouter({
  getInstitutions: protectedProcedure
    .use(goCardlessClientMiddleware)
    .input(z.object({ country: z.string() }))
    .query(async ({ input, ctx }) => {
      const data = (await ctx.goCardlessClient.institution.getInstitutions(
        input,
      )) as GetInstitutionsResponse;

      return data;
    }),
  getRequisitions: protectedProcedure
    .use(goCardlessClientMiddleware)
    .query(async ({ ctx }) => {
      const data =
        (await ctx.goCardlessClient.requisition.getRequisitions()) as GetRequisitionsResponse;

      return data;
    }),
  createRequisition: protectedProcedure
    .use(goCardlessClientMiddleware)
    .input(z.object({ institutionId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const data = (await ctx.goCardlessClient.requisition.createRequisition({
        institutionId: input.institutionId,
        redirectUrl: env.VERCEL_URL,
        accountSelection: false,
        redirectImmediate: false,
        reference: "",
        ssn: "",
      })) as RequisitionResponse;

      return data;
    }),
  deleteRequisition: protectedProcedure
    .use(goCardlessClientMiddleware)
    .input(z.object({ requisitionId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.goCardlessClient.requisition.deleteRequisition(
        input.requisitionId,
      );
    }),
  getAccountById: protectedProcedure
    .use(goCardlessClientMiddleware)
    .input(z.object({ accountId: z.string() }))
    .query(async ({ ctx, input }) => {
      const balances = (await ctx.goCardlessClient
        .account(input.accountId)
        .getBalances()) as GetAccountBalancesResponse;

      const metadata = (await ctx.goCardlessClient
        .account(input.accountId)
        .getMetadata()) as GetAccountMetadataResponse;

      const transactions = (await ctx.goCardlessClient
        .account(input.accountId)
        .getTransactions()) as GetAccountTransactionsResponse;

      const item = balances.balances[0]!;
      return {
        id: input.accountId,
        balance: Number(item.balanceAmount.amount),
        currency: item.balanceAmount.currency,
        iban: metadata.iban,
        ownerName: metadata.owner_name,
        institutionId: metadata.institution_id,
        transactions: [
          ...transactions.transactions.booked,
          ...transactions.transactions.pending,
        ].map((transaction) => ({
          id: transaction.transactionId,
          amount: Number(transaction.transactionAmount.amount),
          currency: transaction.transactionAmount.currency,
          counterparty: transaction.debtorName ?? transaction.creditorName,
          date: new Date(transaction.bookingDateTime),
          description:
            transaction.remittanceInformationUnstructured ??
            transaction.remittanceInformationUnstructuredArray?.join(", "),
        })),
      };
    }),
});
