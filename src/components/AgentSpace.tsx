import type { CSSProperties } from 'react';
import AgentCard from './AgentCard';
import type { Agent } from '../types';

interface AgentSpaceProps {
  agents: Agent[];
  antigravity: boolean;
  selectedAgentId: string | null;
  onAgentClick: (agent: Agent) => void;
}

const GRID_LINES = Array.from({ length: 10 }, (_, i) => (i + 1) * 10);

type GridAxis = 'horizontal' | 'vertical';

const GRID_AXIS_STYLES: Record<GridAxis, { className: string; style: (pos: number) => CSSProperties }> = {
  horizontal: { className: 'absolute w-full h-px bg-white', style: (pos) => ({ top: `${pos}%` }) },
  vertical: { className: 'absolute h-full w-px bg-white', style: (pos) => ({ left: `${pos}%` }) },
};

function OrbitingCore() {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="animate-spin-slow">
        <div className="w-32 h-32 rounded-full border border-violet-500/20 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full border border-purple-500/20 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-violet-500 shadow-lg shadow-violet-500/50" />
          </div>
        </div>
      </div>
      <div className="animate-orbit absolute top-1/2 left-1/2">
        <div className="w-4 h-4 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50 -translate-x-1/2 -translate-y-1/2" />
      </div>
    </div>
  );
}

function ZeroGBadge() {
  return (
    <div className="absolute top-4 left-4 flex items-center gap-2 text-violet-400 text-xs">
      <span className="inline-block w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
      Zero-G Mode Active
    </div>
  );
}

function GroundedHint() {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-gray-500 text-xs">
      Toggle antigravity to see agents float ✨
    </div>
  );
}

/** The zero-gravity play area where agent cards float. */
export default function AgentSpace({
  agents,
  antigravity,
  selectedAgentId,
  onAgentClick,
}: AgentSpaceProps) {
  return (
    <div className="relative w-full h-[500px] rounded-3xl border border-white/5 bg-black/20 overflow-hidden mb-6">
      {/* Grid lines */}
      <div className="absolute inset-0 opacity-5">
        {(Object.keys(GRID_AXIS_STYLES) as GridAxis[]).map((axis) =>
          GRID_LINES.map((pos) => {
            const { className, style } = GRID_AXIS_STYLES[axis];
            return <div key={`${axis}-${pos}`} className={className} style={style(pos)} />;
          }),
        )}
      </div>

      {antigravity && (
        <>
          <ZeroGBadge />
          <OrbitingCore />
        </>
      )}

      {agents.map((agent, index) => (
        <AgentCard
          key={agent.id}
          agent={agent}
          index={index}
          antigravity={antigravity}
          isSelected={selectedAgentId === agent.id}
          onClick={() => onAgentClick(agent)}
        />
      ))}

      {!antigravity && <GroundedHint />}
    </div>
  );
}
