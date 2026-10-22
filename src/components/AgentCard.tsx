import type { Agent, AgentStatus } from '../types';
import { floatAnimationFor } from '../data/agents';

const STATUS_BADGE_STYLES: Record<AgentStatus, string> = {
  floating: 'bg-violet-500/20 text-violet-300',
  active: 'bg-green-500/20 text-green-300',
  idle: 'bg-gray-500/20 text-gray-300',
};

interface AgentCardProps {
  agent: Agent;
  index: number;
  antigravity: boolean;
  isSelected: boolean;
  onClick: () => void;
}

export default function AgentCard({
  agent,
  index,
  antigravity,
  isSelected,
  onClick,
}: AgentCardProps) {
  const floatClass = antigravity ? floatAnimationFor(index) : 'grounded';

  return (
    <div
      className={`agent-card absolute cursor-pointer ${floatClass} ${
        isSelected ? 'ring-2 ring-violet-400 ring-offset-2 ring-offset-transparent' : ''
      }`}
      style={{
        left: `${agent.x}%`,
        top: `${agent.y}%`,
        animationDelay: `${(index + 1) * 0.5}s`,
      }}
      onClick={onClick}
    >
      <div
        className={`glass-card rounded-2xl p-4 w-48 ${
          antigravity ? 'animate-pulse-glow' : ''
        }`}
      >
        <div className="flex items-center gap-3 mb-3">
          <div
            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center text-xl shadow-lg`}
          >
            {agent.icon}
          </div>
          <div>
            <h3 className="text-white font-bold text-sm">{agent.config.name}</h3>
            <p className="text-gray-400 text-xs">{agent.config.model}</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span
            className={`text-xs px-2 py-1 rounded-full ${STATUS_BADGE_STYLES[agent.config.status]}`}
          >
            {antigravity ? '🚀 floating' : agent.config.status}
          </span>
          <span className="text-gray-500 text-xs">{agent.config.tools.length} tools</span>
        </div>
      </div>
    </div>
  );
}
