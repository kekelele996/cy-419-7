import type { Item } from './item';
import type { SkillType, SkillCooldown } from './skill';

export interface Player {
  id: string;
  name: string;
  hp: number;
  max_hp: number;
  mp: number;
  max_mp: number;
  level: number;
  exp: number;
  attack: number;
  defense: number;
  position: { x: number; y: number };
  inventory: Item[];
  skills: SkillType[];
  skillCooldowns: SkillCooldown[];
}
