export type AgentStatus = 'active' | 'idle' | 'floating';

export interface AgentConfig {
  name: string;
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  tools: string[];
  status: AgentStatus;
}

export interface Agent {
  id: string;
  config: AgentConfig;
  x: number;
  y: number;
  color: string;
  icon: string;
}
