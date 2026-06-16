import { usePlayerStore } from '../../stores/playerStore';
import { SKILLS } from '../../constants/skill';
import { SkillEffectType, SkillType } from '../../models/skill';

export function SkillPanel() {
  const player = usePlayerStore((s) => s.player);
  const castSkill = usePlayerStore((s) => s.castSkill);

  const handleCastSkill = (skillType: SkillType) => {
    castSkill(skillType);
  };

  return (
    <div className="panel">
      <strong className="block mb-2">技能面板</strong>
      <div className="grid grid-cols-1 gap-2">
        {player.skills.map((skillType) => {
          const skill = SKILLS[skillType];
          const cd = player.skillCooldowns.find((c) => c.skillId === skill.id)?.remaining || 0;
          const onCooldown = cd > 0;
          const noMp = player.mp < skill.mpCost;
          const disabled = onCooldown || noMp;
          const isDamage = skill.effectType === SkillEffectType.DAMAGE;
          const cdPercent = onCooldown ? (cd / skill.cooldown) * 100 : 0;

          return (
            <button
              key={skill.id}
              onClick={() => handleCastSkill(skillType)}
              disabled={disabled}
              className={`relative p-3 rounded text-left transition-all duration-200 ${
                disabled
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : isDamage
                  ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white cursor-pointer shadow-md hover:shadow-lg'
                  : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white cursor-pointer shadow-md hover:shadow-lg'
              }`}
            >
              {onCooldown && (
                <div
                  className="absolute inset-0 bg-black bg-opacity-60 rounded"
                  style={{
                    clipPath: `inset(0 0 ${100 - cdPercent}% 0)`
                  }}
                />
              )}
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <span className="font-bold">[{skill.key}]</span>
                  <span className="ml-2 text-base">{skill.name}</span>
                </div>
                <div className="text-right text-sm">
                  {onCooldown ? (
                    <span className="text-yellow-300 font-bold">CD: {cd}s</span>
                  ) : (
                    <span className={noMp ? 'text-red-300' : 'text-blue-200'}>
                      MP: {skill.mpCost}
                    </span>
                  )}
                </div>
              </div>
              <div className="relative z-10 text-xs mt-1 opacity-80">{skill.description}</div>
              <div className="relative z-10 text-xs mt-1 opacity-70">
                {isDamage ? `伤害: ${skill.value}` : `治疗: ${skill.value}`} | 冷却: {skill.cooldown}s
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
