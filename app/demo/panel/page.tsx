import { getRoster, DEMO_TEAM, DEMO_AS_OF } from "@/lib/demo/data";
import { TeamDashboard } from "@/components/roster/TeamDashboard";
import { teamWeeklyLoad, emergentes } from "@/lib/roster";

export default function PanelPage() {
  const roster = getRoster();

  return (
    <TeamDashboard
      title={DEMO_TEAM}
      asOfLabel={`Estado al ${DEMO_AS_OF}`}
      linkBase="/demo/panel"
      players={roster.map((p) => ({
        id: p.id,
        nombre: p.nombre,
        posicion: p.posicion,
        dorsal: p.dorsal,
        risk: p.risk,
      }))}
      weeklyLoad={teamWeeklyLoad(roster, DEMO_AS_OF)}
      emergentes={emergentes(roster, DEMO_AS_OF)}
    />
  );
}
