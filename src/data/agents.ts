import type { Agent } from '../types';

export const AVAILABLE_MODELS = [
  'gemini-pro',
  'gemini-ultra',
  'gemini-flash',
  'gemini-pro-vision',
  'gemini-nano',
] as const;

export const AVAILABLE_TOOLS = [
  'search',
  'calculator',
  'code',
  'generate',
  'edit',
  'summarize',
  'complete',
  'refactor',
  'debug',
  'analyze',
  'describe',
  'classify',
  'detect',
] as const;

const FLOAT_ANIMATIONS = [
  'animate-float',
  'animate-float-slow',
  'animate-float-reverse',
] as const;

/** Cycling float animation for the agent at the given index. */
export function floatAnimationFor(index: number): string {
  return FLOAT_ANIMATIONS[index % FLOAT_ANIMATIONS.length];
}

export const defaultAgents: Agent[] = [
  {
    id: '1',
    config: {
      name: 'Atlas',
      model: 'gemini-pro',
      temperature: 0.7,
      maxTokens: 2048,
      systemPrompt: 'You are a helpful research assistant.',
      tools: ['search', 'calculator', 'code'],
      status: 'floating',
    },
    x: 15,
    y: 20,
    color: 'from-violet-500 to-purple-600',
    icon: '🛰️',
  },
  {
    id: '2',
    config: {
      name: 'Nova',
      model: 'gemini-ultra',
      temperature: 0.9,
      maxTokens: 4096,
      systemPrompt: 'You are a creative writing assistant.',
      tools: ['generate', 'edit', 'summarize'],
      status: 'floating',
    },
    x: 55,
    y: 15,
    color: 'from-cyan-500 to-blue-600',
    icon: '🌟',
  },
  {
    id: '3',
    config: {
      name: 'Orbit',
      model: 'gemini-flash',
      temperature: 0.3,
      maxTokens: 1024,
      systemPrompt: 'You are a fast code completion agent.',
      tools: ['complete', 'refactor', 'debug'],
      status: 'floating',
    },
    x: 35,
    y: 55,
    color: 'from-emerald-500 to-teal-600',
    icon: '🪐',
  },
  {
    id: '4',
    config: {
      name: 'Quasar',
      model: 'gemini-pro-vision',
      temperature: 0.5,
      maxTokens: 3072,
      systemPrompt: 'You are a multimodal analysis agent.',
      tools: ['analyze', 'describe', 'classify'],
      status: 'floating',
    },
    x: 70,
    y: 45,
    color: 'from-amber-500 to-orange-600',
    icon: '💫',
  },
  {
    id: '5',
    config: {
      name: 'Nebula',
      model: 'gemini-nano',
      temperature: 0.1,
      maxTokens: 512,
      systemPrompt: 'You are a lightweight edge agent.',
      tools: ['classify', 'detect'],
      status: 'floating',
    },
    x: 20,
    y: 70,
    color: 'from-pink-500 to-rose-600',
    icon: '✨',
  },
];
