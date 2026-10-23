import { describe, expect, it } from 'vitest';
import { buildPythonConfig } from '../components/CodePreview';
import { makeAgent } from '../test/factories';

describe('buildPythonConfig', () => {
  const agents = [
    makeAgent({
      id: '1',
      config: {
        name: 'Atlas',
        model: 'gemini-pro',
        temperature: 0.7,
        maxTokens: 2048,
        systemPrompt: 'You are a helpful research assistant.',
        tools: ['search', 'calculator'],
        status: 'idle',
      },
    }),
    makeAgent({
      id: '2',
      config: { name: 'Nova', model: 'gemini-ultra', tools: ['generate'] },
    }),
  ];

  it('starts with the expected import line', () => {
    expect(buildPythonConfig(agents, true)).toMatch(
      /^from google\.antigravity import Agent, LocalAgentConfig/,
    );
  });

  it('reflects the antigravity flag in the generated code', () => {
    expect(buildPythonConfig(agents, true)).toContain('antigravity = True');
    expect(buildPythonConfig(agents, false)).toContain('antigravity = False');
  });

  it('serializes every agent field into the Python snippet', () => {
    const code = buildPythonConfig(agents, false);
    expect(code).toContain('name="Atlas"');
    expect(code).toContain('model="gemini-pro"');
    expect(code).toContain('temperature=0.7');
    expect(code).toContain('max_tokens=2048');
    expect(code).toContain('system_prompt="You are a helpful research assistant."');
    expect(code).toContain('tools=["search","calculator"]');
    expect(code).toContain('name="Nova"');
  });

  it('forces "floating" status when antigravity is on, keeps original otherwise', () => {
    // Atlas has status "idle" in its config.
    expect(buildPythonConfig(agents, true)).toContain('status="floating"');
    expect(buildPythonConfig(agents, false)).toContain('status="idle"');
  });

  it('joins multiple agents with commas inside the agents list', () => {
    const code = buildPythonConfig(agents, true);
    expect(code).toContain('agents = [\n');
    expect((code.match(/Agent\(/g) ?? []).length).toBe(2);
    expect(code).toContain('),\n    Agent(');
  });

  it('handles an empty agent list', () => {
    const code = buildPythonConfig([], true);
    expect(code).toContain('agents = [\n\n]');
    expect(code).toContain('agent.launch(antigravity=antigravity)');
  });

  it('ends with the launch loop', () => {
    const code = buildPythonConfig(agents, true);
    expect(code).toContain('# Launch agents');
    expect(code.trimEnd().endsWith('print(f"🚀 {agent.name} is now {agent.status}")')).toBe(true);
  });
});
