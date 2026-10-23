import type { Agent, AgentConfig } from '../types';

/** A complete default agent config for tests to override. */
export function makeConfig(overrides: Partial<AgentConfig> = {}): AgentConfig {
  return {
    name: 'Test Agent',
    model: 'gemini-pro',
    temperature: 0.5,
    maxTokens: 1024,
    systemPrompt: 'You are a test agent.',
    tools: ['search'],
    status: 'floating',
    ...overrides,
  };
}

/** A complete default agent for tests to override. */
export function makeAgent(
  overrides: Partial<Agent> & { config?: Partial<AgentConfig> } = {},
): Agent {
  const { config: configOverrides, ...agentOverrides } = overrides;
  return {
    id: 'agent-1',
    config: makeConfig(configOverrides),
    x: 10,
    y: 20,
    color: 'from-violet-500 to-purple-600',
    icon: '🤖',
    ...agentOverrides,
  };
}
