import { useState, useEffect, useCallback } from 'react';

interface AgentConfig {
  name: string;
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  tools: string[];
  status: 'active' | 'idle' | 'floating';
}

interface Agent {
  id: string;
  config: AgentConfig;
  x: number;
  y: number;
  color: string;
  icon: string;
}

const defaultAgents: Agent[] = [
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

function StarField() {
  const stars = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 8,
    duration: Math.random() * 6 + 6,
  }));

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white opacity-60"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animation: `drift ${star.duration}s ease-in-out ${star.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function AgentCard({
  agent,
  antigravity,
  onClick,
  isSelected,
}: {
  agent: Agent;
  antigravity: boolean;
  onClick: () => void;
  isSelected: boolean;
}) {
  const floatClass = antigravity
    ? agent.id === '1'
      ? 'animate-float'
      : agent.id === '2'
      ? 'animate-float-slow'
      : agent.id === '3'
      ? 'animate-float-reverse'
      : agent.id === '4'
      ? 'animate-float'
      : 'animate-float-slow'
    : 'grounded';

  return (
    <div
      className={`agent-card absolute cursor-pointer ${floatClass} ${
        isSelected ? 'ring-2 ring-violet-400 ring-offset-2 ring-offset-transparent' : ''
      }`}
      style={{
        left: `${agent.x}%`,
        top: `${agent.y}%`,
        animationDelay: `${parseInt(agent.id) * 0.5}s`,
      }}
      onClick={onClick}
    >
      <div className={`glass-card rounded-2xl p-4 w-48 ${antigravity ? 'animate-pulse-glow' : ''}`}>
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
            className={`text-xs px-2 py-1 rounded-full ${
              agent.config.status === 'floating'
                ? 'bg-violet-500/20 text-violet-300'
                : agent.config.status === 'active'
                ? 'bg-green-500/20 text-green-300'
                : 'bg-gray-500/20 text-gray-300'
            }`}
          >
            {antigravity ? '🚀 floating' : agent.config.status}
          </span>
          <span className="text-gray-500 text-xs">{agent.config.tools.length} tools</span>
        </div>
      </div>
    </div>
  );
}

function ConfigPanel({
  agent,
  onUpdate,
  onClose,
}: {
  agent: Agent;
  onUpdate: (config: AgentConfig) => void;
  onClose: () => void;
}) {
  const [config, setConfig] = useState<AgentConfig>(agent.config);

  useEffect(() => {
    setConfig(agent.config);
  }, [agent]);

  const handleSave = () => {
    onUpdate(config);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="glass-card rounded-3xl p-6 w-full max-w-lg relative z-10 animate-fade-in-up border border-violet-500/30">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center text-2xl`}
            >
              {agent.icon}
            </div>
            <div>
              <h2 className="text-white text-xl font-bold">LocalAgentConfig</h2>
              <p className="text-gray-400 text-sm">Configure {agent.config.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/20 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-gray-300 text-sm font-medium mb-1 block">Agent Name</label>
            <input
              type="text"
              value={config.name}
              onChange={(e) => setConfig({ ...config, name: e.target.value })}
              className="config-input w-full rounded-lg px-4 py-2 text-white text-sm"
            />
          </div>

          <div>
            <label className="text-gray-300 text-sm font-medium mb-1 block">Model</label>
            <select
              value={config.model}
              onChange={(e) => setConfig({ ...config, model: e.target.value })}
              className="config-input w-full rounded-lg px-4 py-2 text-white text-sm"
            >
              <option value="gemini-pro">gemini-pro</option>
              <option value="gemini-ultra">gemini-ultra</option>
              <option value="gemini-flash">gemini-flash</option>
              <option value="gemini-pro-vision">gemini-pro-vision</option>
              <option value="gemini-nano">gemini-nano</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-300 text-sm font-medium mb-1 block">
                Temperature: {config.temperature}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={config.temperature}
                onChange={(e) =>
                  setConfig({ ...config, temperature: parseFloat(e.target.value) })
                }
                className="w-full accent-violet-500"
              />
            </div>
            <div>
              <label className="text-gray-300 text-sm font-medium mb-1 block">Max Tokens</label>
              <input
                type="number"
                value={config.maxTokens}
                onChange={(e) =>
                  setConfig({ ...config, maxTokens: parseInt(e.target.value) || 0 })
                }
                className="config-input w-full rounded-lg px-4 py-2 text-white text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-gray-300 text-sm font-medium mb-1 block">System Prompt</label>
            <textarea
              value={config.systemPrompt}
              onChange={(e) => setConfig({ ...config, systemPrompt: e.target.value })}
              rows={3}
              className="config-input w-full rounded-lg px-4 py-2 text-white text-sm resize-none"
            />
          </div>

          <div>
            <label className="text-gray-300 text-sm font-medium mb-2 block">Tools</label>
            <div className="flex flex-wrap gap-2">
              {['search', 'calculator', 'code', 'generate', 'edit', 'summarize', 'complete', 'refactor', 'debug', 'analyze', 'describe', 'classify', 'detect'].map((tool) => (
                <button
                  key={tool}
                  onClick={() => {
                    const tools = config.tools.includes(tool)
                      ? config.tools.filter((t) => t !== tool)
                      : [...config.tools, tool];
                    setConfig({ ...config, tools });
                  }}
                  className={`text-xs px-3 py-1.5 rounded-full transition-all ${
                    config.tools.includes(tool)
                      ? 'bg-violet-500/30 text-violet-200 border border-violet-500/50'
                      : 'bg-white/5 text-gray-400 border border-white/10 hover:border-white/30'
                  }`}
                >
                  {tool}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium py-2.5 rounded-xl hover:from-violet-500 hover:to-purple-500 transition-all shadow-lg shadow-violet-500/25"
            >
              Save Configuration
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-white/10 text-gray-300 hover:bg-white/20 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CodePreview({ agents, antigravity }: { agents: Agent[]; antigravity: boolean }) {
  const codeString = `from google.antigravity import Agent, LocalAgentConfig

# Initialize antigravity mode
antigravity = ${antigravity}

# Configure agents
agents = [
${agents
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
    )`
  )
  .join(',\n')}
]

# Launch agents
for agent in agents:
    agent.launch(antigravity=antigravity)
    print(f"🚀 {agent.name} is now {agent.status}")`;

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

export default function App() {
  const [agents, setAgents] = useState<Agent[]>(defaultAgents);
  const [antigravity, setAntigravity] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [launchCount, setLaunchCount] = useState(0);

  const handleToggleAntigravity = useCallback(() => {
    setAntigravity((prev) => !prev);
  }, []);

  const handleAgentClick = (agent: Agent) => {
    setSelectedAgent(agent);
    setShowConfig(true);
  };

  const handleUpdateAgent = (config: AgentConfig) => {
    setAgents((prev) =>
      prev.map((a) => (a.id === selectedAgent?.id ? { ...a, config } : a))
    );
  };

  const handleLaunchAll = () => {
    setAntigravity(true);
    setLaunchCount((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-violet-950 text-white relative overflow-hidden">
      <StarField />

      {/* Ambient orbs */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-1/2 right-1/3 w-64 h-64 bg-purple-600/8 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-xl animate-float shadow-lg shadow-violet-500/30">
            🚀
          </div>
          <div>
            <h1 className="text-xl font-bold neon-text">Antigravity Agent Lab</h1>
            <p className="text-gray-400 text-xs">from google.antigravity import Agent, LocalAgentConfig</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCode(!showCode)}
            className="px-4 py-2 rounded-xl glass-card text-sm text-gray-300 hover:text-white transition-colors"
          >
            {showCode ? '🔮 Hide Code' : '🐍 View Code'}
          </button>
          <button
            onClick={handleLaunchAll}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-sm font-medium hover:from-violet-500 hover:to-purple-500 transition-all shadow-lg shadow-violet-500/25"
          >
            🚀 Launch All
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-6 pb-6">
        {/* Control Bar */}
        <div className="glass-card rounded-2xl p-4 mb-6 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <button
                onClick={handleToggleAntigravity}
                className={`relative w-14 h-7 rounded-full transition-all duration-500 ${
                  antigravity
                    ? 'bg-gradient-to-r from-violet-500 to-purple-500'
                    : 'bg-gray-700'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-500 ${
                    antigravity ? 'left-7.5' : 'left-0.5'
                  }`}
                  style={{ left: antigravity ? '30px' : '2px' }}
                />
              </button>
              <span className="text-sm text-gray-300">
                Antigravity: <span className={antigravity ? 'text-violet-400 font-bold' : 'text-gray-500'}>{antigravity ? 'ON' : 'OFF'}</span>
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

        {/* Agent Space */}
        <div className="relative w-full h-[500px] rounded-3xl border border-white/5 bg-black/20 overflow-hidden mb-6">
          {/* Grid lines */}
          <div className="absolute inset-0 opacity-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={`h-${i}`}
                className="absolute w-full h-px bg-white"
                style={{ top: `${(i + 1) * 10}%` }}
              />
            ))}
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={`v-${i}`}
                className="absolute h-full w-px bg-white"
                style={{ left: `${(i + 1) * 10}%` }}
              />
            ))}
          </div>

          {/* Antigravity indicator */}
          {antigravity && (
            <div className="absolute top-4 left-4 flex items-center gap-2 text-violet-400 text-xs">
              <span className="inline-block w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
              Zero-G Mode Active
            </div>
          )}

          {/* Orbiting element */}
          {antigravity && (
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
          )}

          {/* Agents */}
          {agents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              antigravity={antigravity}
              onClick={() => handleAgentClick(agent)}
              isSelected={selectedAgent?.id === agent.id}
            />
          ))}

          {/* Empty state hint */}
          {!antigravity && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-gray-500 text-xs">
              Toggle antigravity to see agents float ✨
            </div>
          )}
        </div>

        {/* Code Preview */}
        {showCode && (
          <div className="animate-fade-in-up">
            <CodePreview agents={agents} antigravity={antigravity} />
          </div>
        )}

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="glass-card rounded-2xl p-5">
            <div className="text-2xl mb-2">🛸</div>
            <h3 className="text-white font-bold mb-1">Antigravity Mode</h3>
            <p className="text-gray-400 text-sm">
              Toggle zero-gravity to release agents from their orbital constraints. Watch them float freely through space.
            </p>
          </div>
          <div className="glass-card rounded-2xl p-5">
            <div className="text-2xl mb-2">⚙️</div>
            <h3 className="text-white font-bold mb-1">LocalAgentConfig</h3>
            <p className="text-gray-400 text-sm">
              Click any agent to configure its model, temperature, tools, and system prompt using the LocalAgentConfig panel.
            </p>
          </div>
          <div className="glass-card rounded-2xl p-5">
            <div className="text-2xl mb-2">🐍</div>
            <h3 className="text-white font-bold mb-1">Python API</h3>
            <p className="text-gray-400 text-sm">
              View the generated Python code that mirrors your configuration. Ready to deploy to production.
            </p>
          </div>
        </div>
      </main>

      {/* Config Modal */}
      {showConfig && selectedAgent && (
        <ConfigPanel
          agent={selectedAgent}
          onUpdate={handleUpdateAgent}
          onClose={() => {
            setShowConfig(false);
            setSelectedAgent(null);
          }}
        />
      )}
    </div>
  );
}
