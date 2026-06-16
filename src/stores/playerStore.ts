import { create } from 'zustand';
import type { Player } from '../models/player';
import type { SkillType, SkillCooldown } from '../models/skill';
import { PLAYER_SKILLS, SKILLS } from '../constants/skill';
import { logGame } from '../utils/gameLogger';
import { applySkillEffect } from '../utils/combatCalculator';
import { useDungeonStore } from './dungeonStore';

const initial: Player = {
  id: 'p1',
  name: 'Bug Hunter',
  hp: 80,
  max_hp: 80,
  mp: 30,
  max_mp: 30,
  level: 1,
  exp: 0,
  attack: 12,
  defense: 3,
  position: { x: 2, y: 2 },
  inventory: [],
  skills: PLAYER_SKILLS,
  skillCooldowns: PLAYER_SKILLS.map((t) => ({ skillId: SKILLS[t].id, remaining: 0 }))
};

interface PlayerStore {
  player: Player;
  setName: (name: string) => void;
  move: (dx: number, dy: number) => void;
  heal: (v: number) => void;
  consumeMp: (v: number) => boolean;
  recoverMp: (v: number) => void;
  getSkillCooldown: (skillId: string) => number;
  setSkillCooldown: (skillId: string, remaining: number) => void;
  tickCooldowns: () => void;
  castSkill: (skillType: SkillType) => number;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  player: initial,

  setName: (name) => set((s) => ({ player: { ...s.player, name } })),

  move: (dx, dy) =>
    set((s) => {
      const p = {
        ...s.player,
        position: {
          x: Math.max(1, Math.min(16, s.player.position.x + dx)),
          y: Math.max(1, Math.min(10, s.player.position.y + dy))
        }
      };
      logGame('PLAYER_MOVE', { id: p.id, x: p.position.x, y: p.position.y });
      return { player: p };
    }),

  heal: (v) =>
    set((s) => ({
      player: { ...s.player, hp: Math.min(s.player.max_hp, s.player.hp + v) }
    })),

  consumeMp: (v) => {
    const { player } = get();
    if (player.mp < v) {
      return false;
    }
    set((s) => ({ player: { ...s.player, mp: s.player.mp - v } }));
    return true;
  },

  recoverMp: (v) =>
    set((s) => ({
      player: { ...s.player, mp: Math.min(s.player.max_mp, s.player.mp + v) }
    })),

  getSkillCooldown: (skillId) => {
    const { player } = get();
    const cd = player.skillCooldowns.find((c) => c.skillId === skillId);
    return cd ? cd.remaining : 0;
  },

  setSkillCooldown: (skillId, remaining) =>
    set((s) => {
      const cooldowns = s.player.skillCooldowns.map((c) =>
        c.skillId === skillId ? { ...c, remaining } : c
      );
      return { player: { ...s.player, skillCooldowns: cooldowns } };
    }),

  tickCooldowns: () =>
    set((s) => {
      const cooldowns = s.player.skillCooldowns.map((c) => ({
        ...c,
        remaining: Math.max(0, c.remaining - 1)
      }));
      return { player: { ...s.player, skillCooldowns: cooldowns } };
    }),

  castSkill: (skillType) => {
    const { player } = get();
    const skill = SKILLS[skillType];
    const cooldown = get().getSkillCooldown(skill.id);

    if (cooldown > 0) {
      logGame('SKILL_COOLDOWN', { skill: skill.name, remaining: cooldown });
      return -1;
    }

    if (player.mp < skill.mpCost) {
      logGame('SKILL_NO_MP', { skill: skill.name });
      return -2;
    }

    const consumed = get().consumeMp(skill.mpCost);
    if (!consumed) {
      logGame('SKILL_NO_MP', { skill: skill.name });
      return -2;
    }

    logGame('SKILL_CAST', { skill: skill.name });
    logGame('SKILL_COOLDOWN_START', { skill: skill.name, cooldown: skill.cooldown });

    get().setSkillCooldown(skill.id, skill.cooldown);

    const bugs = useDungeonStore.getState().bugs;
    const latestPlayer = get().player;
    const result = applySkillEffect(skill, latestPlayer, bugs);

    set((s) => ({ player: { ...latestPlayer } }));

    return result;
  }
}));
