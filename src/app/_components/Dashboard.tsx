import { AddIntegrationCard } from "./AddIntegrationCard";
import { InstitutionsSection } from "./InstitutionsSection";

export async function Dashboard() {
  return (
    <div className="flex flex-col gap-6">
      <AddIntegrationCard />
      <InstitutionsSection />
    </div>
  );
}
