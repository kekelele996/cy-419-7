import { usePlayerStore } from '../../stores/playerStore';
import { useGameStore } from '../../stores/gameStore';
import { numberText } from '../../utils/formatters';
import { SKILLS } from '../../constants/skill';
import { SkillEffectType } from '../../models/skill';

export function StatusBar() {
  const p = usePlayerStore((s) => s.player);
  const score = useGameStore((s) => s.score);

  const hpPercent = (p.hp / p.max_hp) * 100;
  const mpPercent = (p.mp / p.max_mp) * 100;

  return (
    <div className="panel">
      <div className="flex flex-wrap gap-4 items-center">
        <span className="font-bold text-lg">{p.name}</span>
        <span>Lv {p.level}</span>
        <span className="flex items-center gap-1">
          <span className="text-red-400">HP</span>
          <div className="w-24 h-3 bg-gray-700 rounded overflow-hidden">
            <div
              className="h-full bg-red-500 transition-all duration-300"
              style={{ width: `${hpPercent}%` }}
            />
          </div>
          <span className="text-sm">
            {p.hp}/{p.max_hp}
          </span>
        </span>
        <span className="flex items-center gap-1">
          <span className="text-blue-400">MP</span>
          <div className="w-24 h-3 bg-gray-700 rounded overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${mpPercent}%` }}
            />
          </div>
          <span className="text-sm">
            {p.mp}/{p.max_mp}
          </span>
        </span>
        <span>Score {numberText(score)}</span>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {p.skills.map((skillType) => {
          const skill = SKILLS[skillType];
          const cd = p.skillCooldowns.find((c) => c.skillId === skill.id)?.remaining || 0;
          const onCooldown = cd > 0;
          const noMp = p.mp < skill.mpCost;
          const isDamage = skill.effectType === SkillEffectType.DAMAGE;
          return (
            <div
              key={skill.id}
              className={`px-2 py-1 rounded text-xs ${
                onCooldown
                  ? 'bg-gray-600 text-gray-400'
                  : noMp
                  ? 'bg-blue-900 text-blue-300'
                  : isDamage
                  ? 'bg-orange-600 text-white'
                  : 'bg-green-600 text-white'
              }`}
              title={skill.description}
            >
              <span className="font-bold">[{skill.key}]</span> {skill.name}
              {onCooldown ? (
                <span className="ml-1 text-yellow-300">CD:{cd}</span>
              ) : (
                <span className="ml-1 text-blue-200">MP:{skill.mpCost}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
