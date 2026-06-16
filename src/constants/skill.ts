import { Skill, SkillType, SkillEffectType } from '../models/skill';

export const SKILLS: Record<SkillType, Skill> = {
  [SkillType.FIREBALL]: {
    id: 'skill_fireball',
    name: '火球术',
    type: SkillType.FIREBALL,
    effectType: SkillEffectType.DAMAGE,
    description: '释放火球对敌人造成高额伤害',
    mpCost: 8,
    cooldown: 3,
    value: 25,
    key: '1'
  },
  [SkillType.ICE_LANCE]: {
    id: 'skill_ice_lance',
    name: '冰刺',
    type: SkillType.ICE_LANCE,
    effectType: SkillEffectType.DAMAGE,
    description: '召唤冰刺穿刺敌人',
    mpCost: 6,
    cooldown: 2,
    value: 18,
    key: '2'
  },
  [SkillType.HEAL]: {
    id: 'skill_heal',
    name: '治疗术',
    type: SkillType.HEAL,
    effectType: SkillEffectType.HEAL,
    description: '恢复自身生命值',
    mpCost: 10,
    cooldown: 4,
    value: 30,
    key: '3'
  },
  [SkillType.LIGHTNING]: {
    id: 'skill_lightning',
    name: '闪电链',
    type: SkillType.LIGHTNING,
    effectType: SkillEffectType.DAMAGE,
    description: '召唤闪电打击敌人',
    mpCost: 12,
    cooldown: 5,
    value: 35,
    key: '4'
  },
  [SkillType.SHIELD]: {
    id: 'skill_shield',
    name: '能量护盾',
    type: SkillType.SHIELD,
    effectType: SkillEffectType.HEAL,
    description: '通过能量恢复少量生命',
    mpCost: 5,
    cooldown: 2,
    value: 15,
    key: '5'
  }
};

export const PLAYER_SKILLS: SkillType[] = [
  SkillType.FIREBALL,
  SkillType.ICE_LANCE,
  SkillType.HEAL,
  SkillType.LIGHTNING,
  SkillType.SHIELD
];
