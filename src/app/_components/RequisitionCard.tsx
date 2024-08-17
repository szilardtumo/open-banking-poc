"use client";

import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { RequisitionActions } from "./RequisitionActions";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { api } from "~/trpc/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { type RequisitionResponse } from "~/server/api/routers/goCardless";
import { useMemo } from "react";

interface RequisitionCardProps {
  requisition: RequisitionResponse;
}

export function RequisitionCard({ requisition }: RequisitionCardProps) {
  const [accounts] = api.useSuspenseQueries((t) =>
    requisition.accounts.map((accountId) =>
      t.goCardless.getAccountById({ accountId }),
    ),
  );

  const transactions = useMemo(() => {
    return accounts
      .flatMap((account) =>
        account.transactions.map((transaction) => ({
          ...transaction,
          iban: account.iban,
        })),
      )
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [accounts]);

  return (
    <Card key={requisition.id}>
      <CardHeader>
        <CardTitle>{requisition.institution_id}</CardTitle>
        <div>
          {requisition.status === "LN" ? (
            <Badge>Active</Badge>
          ) : requisition.status === "EX" ? (
            <Badge variant="destructive">Expired</Badge>
          ) : (
            <Badge variant="secondary">Pending</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {!requisition.accounts.length && (
          <Alert>
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>
              {
                'There are no accounts linked. Click the "Link account" button to add accounts.'
              }
            </AlertDescription>
          </Alert>
        )}

        <h3 className="mt-4">Accounts</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>IBAN</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead className="text-right">Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts.map((account) => (
              <TableRow key={account.id}>
                <TableCell className="font-medium">{account.iban}</TableCell>
                <TableCell>{account.currency}</TableCell>
                <TableCell className="text-right">
                  {new Intl.NumberFormat("en-GB", {
                    style: "currency",
                    currency: account.currency,
                  }).format(account.balance)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <h3 className="mt-8">Transactions</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Account</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={`${transaction.currency}-${transaction.id}`}>
                <TableCell>{transaction.date.toLocaleString()}</TableCell>
                <TableCell>{transaction.iban}</TableCell>
                <TableCell>{transaction.currency}</TableCell>
                <TableCell className="text-right">
                  {new Intl.NumberFormat("en-GB", {
                    style: "currency",
                    currency: transaction.currency,
                  }).format(transaction.amount)}
                </TableCell>
                <TableCell className="text-right">
                  {transaction.description}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <RequisitionActions
          id={requisition.id}
          isActive={requisition.status === "LN"}
          link={requisition.link}
        />
      </CardFooter>
    </Card>
  );
}
