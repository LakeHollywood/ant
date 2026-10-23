import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import AgentSpace from '../components/AgentSpace';
import { makeAgent } from './factories';

const agents = [
  makeAgent({ id: '1', config: { name: 'Atlas' } }),
  makeAgent({ id: '2', config: { name: 'Nova' }, x: 50, y: 50 }),
];

describe('AgentSpace', () => {
  it('renders one card per agent', () => {
    render(
      <AgentSpace
        agents={agents}
        antigravity
        selectedAgentId={null}
        onAgentClick={() => {}}
      />,
    );
    expect(screen.getByText('Atlas')).toBeInTheDocument();
    expect(screen.getByText('Nova')).toBeInTheDocument();
    expect(document.querySelectorAll('.agent-card')).toHaveLength(2);
  });

  it('shows the zero-gravity indicator and orbiting core only when antigravity is on', () => {
    const { rerender } = render(
      <AgentSpace agents={agents} antigravity selectedAgentId={null} onAgentClick={() => {}} />,
    );
    expect(screen.getByText('Zero-G Mode Active')).toBeInTheDocument();

    rerender(
      <AgentSpace agents={agents} antigravity={false} selectedAgentId={null} onAgentClick={() => {}} />,
    );
    expect(screen.queryByText('Zero-G Mode Active')).not.toBeInTheDocument();
    // Hint appears when gravity is restored.
    expect(screen.getByText(/Toggle antigravity to see agents float/)).toBeInTheDocument();
  });

  it('calls onAgentClick with the clicked agent', async () => {
    const user = userEvent.setup();
    const onAgentClick = vi.fn();
    render(
      <AgentSpace agents={agents} antigravity selectedAgentId={null} onAgentClick={onAgentClick} />,
    );

    await user.click(screen.getByText('Nova'));
    expect(onAgentClick).toHaveBeenCalledTimes(1);
    expect(onAgentClick).toHaveBeenCalledWith(expect.objectContaining({ id: '2' }));
  });

  it('marks only the selected agent with the selection ring', () => {
    render(
      <AgentSpace agents={agents} antigravity selectedAgentId="1" onAgentClick={() => {}} />,
    );
    const cards = [...document.querySelectorAll('.agent-card')];
    expect(cards[0].className).toContain('ring-2');
    expect(cards[1].className).not.toContain('ring-2');
  });

  it('renders an empty space without crashing', () => {
    render(<AgentSpace agents={[]} antigravity selectedAgentId={null} onAgentClick={() => {}} />);
    expect(document.querySelectorAll('.agent-card')).toHaveLength(0);
  });
});
