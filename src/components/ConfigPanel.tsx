import { useEffect, useId, useState } from 'react';
import type { Agent, AgentConfig } from '../types';
import { AVAILABLE_MODELS, AVAILABLE_TOOLS } from '../data/agents';

interface ConfigPanelProps {
  agent: Agent;
  onUpdate: (config: AgentConfig) => void;
  onClose: () => void;
}

const inputClass = 'config-input w-full rounded-lg px-4 py-2 text-white text-sm';
const labelClass = 'text-gray-300 text-sm font-medium mb-1 block';

export default function ConfigPanel({ agent, onUpdate, onClose }: ConfigPanelProps) {
  const [config, setConfig] = useState<AgentConfig>(agent.config);
  const fieldIds = useId();

  // Reset the draft whenever a different agent is opened.
  useEffect(() => {
    setConfig(agent.config);
  }, [agent]);

  const updateField = <K extends keyof AgentConfig>(field: K, value: AgentConfig[K]) =>
    setConfig((prev) => ({ ...prev, [field]: value }));

  const toggleTool = (tool: string) =>
    setConfig((prev) => ({
      ...prev,
      tools: prev.tools.includes(tool)
        ? prev.tools.filter((t) => t !== tool)
        : [...prev.tools, tool],
    }));

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
            <label className={labelClass} htmlFor={`${fieldIds}-name`}>Agent Name</label>
            <input
              id={`${fieldIds}-name`}
              type="text"
              value={config.name}
              onChange={(e) => updateField('name', e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass} htmlFor={`${fieldIds}-model`}>Model</label>
            <select
              id={`${fieldIds}-model`}
              value={config.model}
              onChange={(e) => updateField('model', e.target.value)}
              className={inputClass}
            >
              {AVAILABLE_MODELS.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass} htmlFor={`${fieldIds}-temp`}>
                Temperature: {config.temperature}
              </label>
              <input
                id={`${fieldIds}-temp`}
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={config.temperature}
                onChange={(e) => updateField('temperature', parseFloat(e.target.value))}
                className="w-full accent-violet-500"
              />
            </div>
            <div>
              <label className={labelClass} htmlFor={`${fieldIds}-tokens`}>Max Tokens</label>
              <input
                id={`${fieldIds}-tokens`}
                type="number"
                value={config.maxTokens}
                onChange={(e) => updateField('maxTokens', parseInt(e.target.value) || 0)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor={`${fieldIds}-prompt`}>System Prompt</label>
            <textarea
              id={`${fieldIds}-prompt`}
              value={config.systemPrompt}
              onChange={(e) => updateField('systemPrompt', e.target.value)}
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div>
            <label className={`${labelClass} mb-2`}>Tools</label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_TOOLS.map((tool) => {
                const selected = config.tools.includes(tool);
                return (
                  <button
                    key={tool}
                    onClick={() => toggleTool(tool)}
                    className={`text-xs px-3 py-1.5 rounded-full transition-all ${
                      selected
                        ? 'bg-violet-500/30 text-violet-200 border border-violet-500/50'
                        : 'bg-white/5 text-gray-400 border border-white/10 hover:border-white/30'
                    }`}
                  >
                    {tool}
                  </button>
                );
              })}
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
