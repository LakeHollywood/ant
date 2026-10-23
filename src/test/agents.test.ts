import { describe, expect, it } from 'vitest';
import {
  AVAILABLE_MODELS,
  AVAILABLE_TOOLS,
  defaultAgents,
  floatAnimationFor,
} from '../data/agents';

describe('floatAnimationFor', () => {
  const ANIMATIONS = ['animate-float', 'animate-float-slow', 'animate-float-reverse'];

  it('returns animations in order for consecutive indices', () => {
    expect(floatAnimationFor(0)).toBe('animate-float');
    expect(floatAnimationFor(1)).toBe('animate-float-slow');
    expect(floatAnimationFor(2)).toBe('animate-float-reverse');
  });

  it('cycles back to the first animation after the last one', () => {
    expect(floatAnimationFor(3)).toBe('animate-float');
    expect(floatAnimationFor(6)).toBe('animate-float');
    expect(floatAnimationFor(7)).toBe('animate-float-slow');
  });

  it('always returns one of the three known animations', () => {
    for (let i = 0; i < 50; i++) {
      expect(ANIMATIONS).toContain(floatAnimationFor(i));
    }
  });
});

describe('AVAILABLE_MODELS / AVAILABLE_TOOLS', () => {
  it('exposes a non-empty list of unique models', () => {
    expect(AVAILABLE_MODELS.length).toBeGreaterThan(0);
    expect(new Set(AVAILABLE_MODELS).size).toBe(AVAILABLE_MODELS.length);
  });

  it('exposes a non-empty list of unique tools', () => {
    expect(AVAILABLE_TOOLS.length).toBeGreaterThan(0);
    expect(new Set(AVAILABLE_TOOLS).size).toBe(AVAILABLE_TOOLS.length);
  });
});

describe('defaultAgents', () => {
  it('contains five agents with unique ids', () => {
    expect(defaultAgents).toHaveLength(5);
    const ids = defaultAgents.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('gives every agent a valid, complete config', () => {
    for (const agent of defaultAgents) {
      expect(agent.config.name).toBeTruthy();
      expect(AVAILABLE_MODELS).toContain(agent.config.model);
      expect(agent.config.temperature).toBeGreaterThanOrEqual(0);
      expect(agent.config.temperature).toBeLessThanOrEqual(1);
      expect(agent.config.maxTokens).toBeGreaterThan(0);
      expect(agent.config.systemPrompt).toBeTruthy();
      expect(agent.config.tools.length).toBeGreaterThan(0);
      for (const tool of agent.config.tools) {
        expect(AVAILABLE_TOOLS).toContain(tool);
      }
      expect(['active', 'idle', 'floating']).toContain(agent.config.status);
    }
  });

  it('positions every agent within the 0-100 percentage space', () => {
    for (const agent of defaultAgents) {
      expect(agent.x).toBeGreaterThanOrEqual(0);
      expect(agent.x).toBeLessThanOrEqual(100);
      expect(agent.y).toBeGreaterThanOrEqual(0);
      expect(agent.y).toBeLessThanOrEqual(100);
    }
  });

  it('matches the expected first agent (Atlas)', () => {
    const atlas = defaultAgents[0];
    expect(atlas.config.name).toBe('Atlas');
    expect(atlas.config.model).toBe('gemini-pro');
    expect(atlas.config.tools).toEqual(['search', 'calculator', 'code']);
  });
});
