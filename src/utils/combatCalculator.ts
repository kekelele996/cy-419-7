import type { Player } from '../models/player';
import type { Bug } from '../models/bug';
import type { Skill } from '../models/skill';
import { SkillEffectType } from '../models/skill';
import { logGame } from './gameLogger';

export function damage(attacker: number, defense: number) {
  const value = Math.max(1, attacker - defense);
  logGame('COMBAT_DAMAGE', { value });
  return value;
}

export function attackBug(player: Player, bug: Bug) {
  const value = damage(player.attack, bug.defense);
  bug.hp -= value;
  if (bug.hp <= 0) {
    bug.status = 'dead';
    player.exp += 12;
    logGame('BUG_DEAD', { type: bug.type });
  }
  return value;
}

export function calculateSkillDamage(skill: Skill, player: Player, bug?: Bug) {
  const baseDamage = skill.value + Math.floor(player.attack * 0.5);
  if (bug) {
    const finalDamage = Math.max(1, baseDamage - Math.floor(bug.defense * 0.3));
    return finalDamage;
  }
  return baseDamage;
}

export function calculateSkillHeal(skill: Skill, player: Player) {
  return Math.min(skill.value, player.max_hp - player.hp);
}

export function applySkillEffect(skill: Skill, player: Player, bugs: Bug[]) {
  if (skill.effectType === SkillEffectType.DAMAGE) {
    const target = bugs.find((b) => b.status === 'alive');
    if (target) {
      const dmg = calculateSkillDamage(skill, player, target);
      target.hp -= dmg;
      if (target.hp <= 0) {
        target.status = 'dead';
        player.exp += 15;
        logGame('BUG_DEAD', { type: target.type });
      }
      logGame('SKILL_DAMAGE', { skill: skill.name, value: dmg });
      return dmg;
    }
    logGame('SKILL_DAMAGE', { skill: skill.name, value: 0 });
    return 0;
  }

  if (skill.effectType === SkillEffectType.HEAL) {
    const healAmount = calculateSkillHeal(skill, player);
    player.hp = Math.min(player.max_hp, player.hp + healAmount);
    logGame('SKILL_HEAL', { skill: skill.name, value: healAmount });
    return healAmount;
  }

  return 0;
}
