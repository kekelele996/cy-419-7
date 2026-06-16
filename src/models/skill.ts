export enum SkillType {
  FIREBALL = 'fireball',
  ICE_LANCE = 'ice_lance',
  HEAL = 'heal',
  LIGHTNING = 'lightning',
  SHIELD = 'shield'
}

export enum SkillEffectType {
  DAMAGE = 'damage',
  HEAL = 'heal',
  BUFF = 'buff'
}

export interface Skill {
  id: string;
  name: string;
  type: SkillType;
  effectType: SkillEffectType;
  description: string;
  mpCost: number;
  cooldown: number;
  value: number;
  key: string;
}

export interface SkillCooldown {
  skillId: string;
  remaining: number;
}
