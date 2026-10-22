import { useCallback, useState } from 'react';
import type { Agent, AgentConfig } from './types';
import { defaultAgents } from './data/agents';
import StarField from './components/StarField';
import AgentSpace from './components/AgentSpace';
import ConfigPanel from './components/ConfigPanel';
import CodePreview from './components/CodePreview';

const INFO_CARDS = [
  {
    icon: '🛸',
    title: 'Antigravity Mode',
    description:
      'Toggle zero-gravity to release agents from their orbital constraints. Watch them float freely through space.',
  },
  {
    icon: '⚙️',
    title: 'LocalAgentConfig',
    description:
      'Click any agent to configure its model, temperature, tools, and system prompt using the LocalAgentConfig panel.',
  },
  {
    icon: '🐍',
    title: 'Python API',
    description:
      'View the generated Python code that mirrors your configuration. Ready to deploy to production.',
  },
];

function AmbientOrbs() {
  return (
    <>
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-1/2 right-1/3 w-64 h-64 bg-purple-600/8 rounded-full blur-3xl pointer-events-none" />
    </>
  );
}

interface HeaderProps {
  showCode: boolean;
  onToggleCode: () => void;
  onLaunchAll: () => void;
}

function Header({ showCode, onToggleCode, onLaunchAll }: HeaderProps) {
  return (
    <header className="relative z-10 px-6 py-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-xl animate-float shadow-lg shadow-violet-500/30">
          🚀
        </div>
        <div>
          <h1 className="text-xl font-bold neon-text">Antigravity Agent Lab</h1>
          <p className="text-gray-400 text-xs">
            from google.antigravity import Agent, LocalAgentConfig
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleCode}
          className="px-4 py-2 rounded-xl glass-card text-sm text-gray-300 hover:text-white transition-colors"
        >
          {showCode ? '🔮 Hide Code' : '🐍 View Code'}
        </button>
        <button
          onClick={onLaunchAll}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-sm font-medium hover:from-violet-500 hover:to-purple-500 transition-all shadow-lg shadow-violet-500/25"
        >
          🚀 Launch All
        </button>
      </div>
    </header>
  );
}

interface ControlBarProps {
  agents: Agent[];
  antigravity: boolean;
  launchCount: number;
  onToggleAntigravity: () => void;
}

function ControlBar({ agents, antigravity, launchCount, onToggleAntigravity }: ControlBarProps) {
  return (
    <div className="glass-card rounded-2xl p-4 mb-6 flex items-center justify-between flex-wrap gap-4">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleAntigravity}
            aria-pressed={antigravity}
            className={`relative w-14 h-7 rounded-full transition-all duration-500 ${
              antigravity ? 'bg-gradient-to-r from-violet-500 to-purple-500' : 'bg-gray-700'
            }`}
          >
            <div
              className="absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-500"
              style={{ left: antigravity ? '30px' : '2px' }}
            />
          </button>
          <span className="text-sm text-gray-300">
            Antigravity:{' '}
            <span className={antigravity ? 'text-violet-400 font-bold' : 'text-gray-500'}>
              {antigravity ? 'ON' : 'OFF'}
            </span>
          </span>
        </div>
        <div className="text-sm text-gray-400">
          Agents: <span className="text-white font-bold">{agents.length}</span>
        </div>
        <div className="text-sm text-gray-400">
          Launches: <span className="text-emerald-400 font-bold">{launchCount}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        System operational
      </div>
    </div>
  );
}

export default function App() {
  const [agents, setAgents] = useState<Agent[]>(defaultAgents);
  const [antigravity, setAntigravity] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [launchCount, setLaunchCount] = useState(0);

  const toggleAntigravity = useCallback(() => setAntigravity((prev) => !prev), []);

  const handleAgentClick = (agent: Agent) => {
    setSelectedAgent(agent);
    setShowConfig(true);
  };

  const handleUpdateAgent = (config: AgentConfig) => {
    setAgents((prev) =>
      prev.map((a) => (a.id === selectedAgent?.id ? { ...a, config } : a)),
    );
  };

  const handleLaunchAll = () => {
    setAntigravity(true);
    setLaunchCount((prev) => prev + 1);
  };

  const closeConfig = () => {
    setShowConfig(false);
    setSelectedAgent(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-violet-950 text-white relative overflow-hidden">
      <StarField />
      <AmbientOrbs />

      <Header
        showCode={showCode}
        onToggleCode={() => setShowCode((prev) => !prev)}
        onLaunchAll={handleLaunchAll}
      />

      <main className="relative z-10 px-6 pb-6">
        <ControlBar
          agents={agents}
          antigravity={antigravity}
          launchCount={launchCount}
          onToggleAntigravity={toggleAntigravity}
        />

        <AgentSpace
          agents={agents}
          antigravity={antigravity}
          selectedAgentId={selectedAgent?.id ?? null}
          onAgentClick={handleAgentClick}
        />

        {showCode && (
          <div className="animate-fade-in-up">
            <CodePreview agents={agents} antigravity={antigravity} />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {INFO_CARDS.map((card) => (
            <div key={card.title} className="glass-card rounded-2xl p-5">
              <div className="text-2xl mb-2">{card.icon}</div>
              <h3 className="text-white font-bold mb-1">{card.title}</h3>
              <p className="text-gray-400 text-sm">{card.description}</p>
            </div>
          ))}
        </div>
      </main>

      {showConfig && selectedAgent && (
        <ConfigPanel agent={selectedAgent} onUpdate={handleUpdateAgent} onClose={closeConfig} />
      )}
    </div>
  );
}
