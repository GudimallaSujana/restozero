import Card from "./Card";

export default function LeaderboardTable({ data }: { data: any[] }) {
  return (
    <Card title="Top Efficient Restaurants">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500">
              <th>Rank</th>
              <th>Restaurant</th>
              <th>Efficiency</th>
              <th>Sold/Prepared</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.rank} className="border-t border-white/20">
                <td className="py-2">#{row.rank}</td>
                <td>{row.restaurant}</td>
                <td>{row.efficiency}%</td>
                <td>{row.totalSold}/{row.totalPrepared}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
