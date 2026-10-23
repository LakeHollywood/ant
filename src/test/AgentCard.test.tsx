import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import AgentCard from '../components/AgentCard';
import { makeAgent } from './factories';

function renderCard(
  props: Partial<React.ComponentProps<typeof AgentCard>> = {},
) {
  const onClick = vi.fn();
  render(
    <AgentCard
      agent={makeAgent()}
      index={0}
      antigravity
      isSelected={false}
      onClick={onClick}
      {...props}
    />,
  );
  return { onClick };
}

describe('AgentCard', () => {
  it('shows the agent name, model, icon and tool count', () => {
    renderCard({
      agent: makeAgent({
        config: { name: 'Atlas', model: 'gemini-pro', tools: ['search', 'code', 'edit'] },
        icon: '🛰️',
      }),
    });

    expect(screen.getByText('Atlas')).toBeInTheDocument();
    expect(screen.getByText('gemini-pro')).toBeInTheDocument();
    expect(screen.getByText('🛰️')).toBeInTheDocument();
    expect(screen.getByText('3 tools')).toBeInTheDocument();
  });

  it('displays the floating badge when antigravity is on', () => {
    renderCard({
      antigravity: true,
      agent: makeAgent({ config: { status: 'idle' } }),
    });
    // Antigravity overrides the stored status with "floating".
    expect(screen.getByText('🚀 floating')).toBeInTheDocument();
  });

  it('displays the stored status when antigravity is off', () => {
    renderCard({ antigravity: false, agent: makeAgent({ config: { status: 'active' } }) });
    expect(screen.getByText('active')).toBeInTheDocument();
    expect(screen.queryByText('🚀 floating')).not.toBeInTheDocument();
  });

  it('calls onClick with no arguments when the card is clicked', async () => {
    const user = userEvent.setup();
    const { onClick } = renderCard();
    await user.click(screen.getByText('Test Agent'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('positions itself using the agent x/y percentages', () => {
    renderCard({ agent: makeAgent({ x: 42, y: 68 }) });
    const card = screen.getByText('Test Agent').closest('.agent-card');
    expect(card).toHaveStyle({ left: '42%', top: '68%' });
  });

  it('uses a float animation class when antigravity is on and grounded when off', () => {
    const { rerender } = render(
      <AgentCard
        agent={makeAgent()}
        index={1}
        antigravity
        isSelected={false}
        onClick={() => {}}
      />,
    );
    let card = document.querySelector('.agent-card');
    expect(card?.className).toContain('animate-float-slow');

    rerender(
      <AgentCard
        agent={makeAgent()}
        index={1}
        antigravity={false}
        isSelected={false}
        onClick={() => {}}
      />,
    );
    card = document.querySelector('.agent-card');
    expect(card?.className).toContain('grounded');
    expect(card?.className).not.toContain('animate-float');
  });

  it('adds a selection ring only when selected', () => {
    const { rerender } = render(
      <AgentCard
        agent={makeAgent()}
        index={0}
        antigravity
        isSelected={false}
        onClick={() => {}}
      />,
    );
    expect(document.querySelector('.agent-card')?.className).not.toContain('ring-2');

    rerender(
      <AgentCard
        agent={makeAgent()}
        index={0}
        antigravity
        isSelected
        onClick={() => {}}
      />,
    );
    expect(document.querySelector('.agent-card')?.className).toContain('ring-2');
  });
});
