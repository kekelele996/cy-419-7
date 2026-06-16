import { useEffect } from 'react';
import { usePlayerStore } from '../stores/playerStore';
import { useGameStore } from '../stores/gameStore';
import { SKILLS, PLAYER_SKILLS } from '../constants/skill';

export function useKeyboard() {
  const move = usePlayerStore((s) => s.move);
  const castSkill = usePlayerStore((s) => s.castSkill);
  const pause = useGameStore((s) => s.pause);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') move(0, -1);
      if (e.key === 'ArrowDown') move(0, 1);
      if (e.key === 'ArrowLeft') move(-1, 0);
      if (e.key === 'ArrowRight') move(1, 0);
      if (e.key === ' ') pause();
      if (e.key.toLowerCase() === 'f')
        document.fullscreenElement
          ? document.exitFullscreen()
          : document.documentElement.requestFullscreen?.();

      for (const skillType of PLAYER_SKILLS) {
        const skill = SKILLS[skillType];
        if (e.key === skill.key) {
          castSkill(skillType);
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [move, castSkill, pause]);
}
