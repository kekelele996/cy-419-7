import { GameCanvas } from '../components/common/GameCanvas';
import { StatusBar } from '../components/common/StatusBar';
import { MiniMap } from '../components/common/MiniMap';
import { CombatLog } from '../components/common/CombatLog';
import { InventoryPanel } from '../components/common/InventoryPanel';
import { SkillPanel } from '../components/common/SkillPanel';

export function Game() {
  return (
    <main className="page">
      <StatusBar />
      <div className="grid mt-4">
        <GameCanvas />
        <div className="grid">
          <MiniMap />
          <SkillPanel />
          <InventoryPanel />
          <CombatLog />
        </div>
      </div>
    </main>
  );
}
