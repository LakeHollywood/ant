import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import CodePreview from '../components/CodePreview';
import { makeAgent } from './factories';

describe('CodePreview', () => {
  it('shows the agent_config.py filename in the terminal header', () => {
    render(<CodePreview agents={[makeAgent()]} antigravity />);
    expect(screen.getByText('agent_config.py')).toBeInTheDocument();
  });

  it('renders the generated Python code inside a <code> block', () => {
    const agents = [
      makeAgent({ config: { name: 'Atlas', model: 'gemini-pro', temperature: 0.7, maxTokens: 2048 } }),
    ];
    render(<CodePreview agents={agents} antigravity={false} />);

    const code = screen.getByText(/from google\.antigravity import/);
    expect(code.tagName).toBe('CODE');
    expect(code.textContent).toContain('name="Atlas"');
    expect(code.textContent).toContain('temperature=0.7');
    expect(code.textContent).toContain('max_tokens=2048');
    expect(code.textContent).toContain('antigravity = False');
  });

  it('updates the rendered code when props change', () => {
    const { rerender } = render(<CodePreview agents={[makeAgent()]} antigravity={false} />);
    expect(screen.getByText(/antigravity = False/)).toBeInTheDocument();

    rerender(<CodePreview agents={[makeAgent()]} antigravity />);
    expect(screen.getByText(/antigravity = True/)).toBeInTheDocument();
  });
});
