"use client";

import { api } from "~/trpc/react";
import { RequisitionCard } from "./RequisitionCard";

export function InstitutionsSection() {
  const [requisitions] = api.goCardless.getRequisitions.useSuspenseQuery();

  return (
    <>
      <h2>Integrations</h2>
      {requisitions.results.map((requisition) => (
        <RequisitionCard key={requisition.id} requisition={requisition} />
      ))}
    </>
  );
}
