import { useMemo } from 'react';
import type { Agent } from '../types';

interface CodePreviewProps {
  agents: Agent[];
  antigravity: boolean;
}

/** Generate the Python snippet mirroring the current agent configuration. */
export function buildPythonConfig(agents: Agent[], antigravity: boolean): string {
  const agentLines = agents
    .map(
      (a) => `    Agent(
        name="${a.config.name}",
        config=LocalAgentConfig(
            model="${a.config.model}",
            temperature=${a.config.temperature},
            max_tokens=${a.config.maxTokens},
            system_prompt="${a.config.systemPrompt}",
            tools=${JSON.stringify(a.config.tools)},
        ),
        status="${antigravity ? 'floating' : a.config.status}",
    )`,
    )
    .join(',\n');

  return `from google.antigravity import Agent, LocalAgentConfig

# Initialize antigravity mode
antigravity = ${antigravity ? 'True' : 'False'}

# Configure agents
agents = [
${agentLines}
]

# Launch agents
for agent in agents:
    agent.launch(antigravity=antigravity)
    print(f"🚀 {agent.name} is now {agent.status}")`;
}

/** Terminal-styled panel showing the generated Python configuration. */
export default function CodePreview({ agents, antigravity }: CodePreviewProps) {
  const codeString = useMemo(() => buildPythonConfig(agents, antigravity), [agents, antigravity]);

  return (
    <div className="glass-card rounded-2xl p-4 border border-violet-500/20">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="text-gray-400 text-xs ml-2">agent_config.py</span>
      </div>
      <pre className="text-xs text-gray-300 overflow-x-auto font-mono leading-relaxed">
        <code>{codeString}</code>
      </pre>
    </div>
  );
}
