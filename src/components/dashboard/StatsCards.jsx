import { Film, Scissors, Clock } from "lucide-react";

export default function StatsCards({ projects, segments }) {
  const totalProjects = projects.length;
  const totalSegments = segments.length;
  const totalDuration = segments.reduce((acc, seg) => {
    return acc + ((seg.end_time || 0) - (seg.start_time || 0));
  }, 0);
  
  const stats = [
    {
      label: "Projects",
      value: totalProjects,
      icon: Film,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Clips Generated",
      value: totalSegments,
      icon: Scissors,
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      label: "Total Duration",
      value: `${Math.floor(totalDuration / 60)}m`,
      icon: Clock,
      color: "text-chart-3",
      bg: "bg-chart-3/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="relative overflow-hidden rounded-xl bg-card border border-border p-5"
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${stat.bg}`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}