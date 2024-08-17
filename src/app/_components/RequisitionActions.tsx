"use client";

import Link from "next/link";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

interface RequisitionActionsProps {
  id: string;
  link: string;
  isActive: boolean;
}

export function RequisitionActions({
  id,
  link,
  isActive,
}: RequisitionActionsProps) {
  const utils = api.useUtils();

  const { mutate } = api.goCardless.deleteRequisition.useMutation({
    onSuccess: () => utils.goCardless.getRequisitions.invalidate(),
  });

  return (
    <div className="flex w-full justify-end gap-2">
      {!isActive && (
        <Button asChild>
          <Link href={link}>Link accounts</Link>
        </Button>
      )}
      <Button
        variant="destructive"
        onClick={() => mutate({ requisitionId: id })}
      >
        Delete integration
      </Button>
    </div>
  );
}
