import type { ReactNode } from "react";
import Card from "./Card";

export default function ChartCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card title={title} className="h-[320px]">
      <div className="h-[250px]">{children}</div>
    </Card>
  );
}
