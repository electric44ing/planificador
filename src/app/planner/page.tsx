import Board from "@/components/Board";
import PlannerHeader from "@/components/planner/PlannerHeader";

export default function PlannerPage() {
  return (
    <div className="w-full">
      <PlannerHeader />
      <div className="w-full max-w-7xl mx-auto">
        <Board />
      </div>
    </div>
  );
}
