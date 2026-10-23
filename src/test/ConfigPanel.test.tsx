import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import ConfigPanel from '../components/ConfigPanel';
import { AVAILABLE_MODELS, AVAILABLE_TOOLS } from '../data/agents';
import { makeAgent, makeConfig } from './factories';

function renderPanel(props: Partial<React.ComponentProps<typeof ConfigPanel>> = {}) {
  const onUpdate = vi.fn();
  const onClose = vi.fn();
  const agent = makeAgent({ config: makeConfig({ name: 'Atlas', tools: ['search'] }) });
  render(<ConfigPanel agent={agent} onUpdate={onUpdate} onClose={onClose} {...props} />);
  return { onUpdate, onClose, agent };
}

describe('ConfigPanel', () => {
  it('renders the title and identifies the agent being configured', () => {
    renderPanel();
    expect(screen.getByText('LocalAgentConfig')).toBeInTheDocument();
    expect(screen.getByText('Configure Atlas')).toBeInTheDocument();
  });

  it('prefills inputs with the agent config values', () => {
    renderPanel();
    expect(screen.getByLabelText('Agent Name')).toHaveValue('Atlas');
    expect(screen.getByLabelText('Model')).toHaveValue('gemini-pro');
    expect(screen.getByLabelText(/Max Tokens/)).toHaveValue(1024);
    expect(screen.getByLabelText('System Prompt')).toHaveValue('You are a test agent.');
  });

  it('lists every available model as a selectable option', () => {
    renderPanel();
    for (const model of AVAILABLE_MODELS) {
      expect(screen.getByRole('option', { name: model })).toBeInTheDocument();
    }
    expect(screen.getAllByRole('option')).toHaveLength(AVAILABLE_MODELS.length);
  });

  it('marks currently-selected tools as active and toggles them on click', async () => {
    const user = userEvent.setup();
    renderPanel();

    const searchBtn = screen.getByRole('button', { name: 'search' });
    const codeBtn = screen.getByRole('button', { name: 'code' });
    expect(searchBtn.className).toContain('bg-violet-500/30'); // already selected
    expect(codeBtn.className).not.toContain('bg-violet-500/30');

    await user.click(codeBtn); // add a tool
    expect(codeBtn.className).toContain('bg-violet-500/30');

    await user.click(searchBtn); // remove a tool
    expect(searchBtn.className).not.toContain('bg-violet-500/30');
  });

  it('shows one button per available tool', () => {
    renderPanel();
    for (const tool of AVAILABLE_TOOLS) {
      expect(screen.getByRole('button', { name: tool })).toBeInTheDocument();
    }
  });

  it('saves the edited configuration and closes on Save', async () => {
    const user = userEvent.setup();
    const { onUpdate, onClose } = renderPanel();

    await user.clear(screen.getByLabelText('Agent Name'));
    await user.type(screen.getByLabelText('Agent Name'), 'Atlas V2');
    await user.clear(screen.getByLabelText(/Max Tokens/));
    await user.type(screen.getByLabelText(/Max Tokens/), '4096');
    await user.selectOptions(screen.getByLabelText('Model'), 'gemini-flash');
    await user.click(screen.getByRole('button', { name: 'debug' }));

    await user.click(screen.getByRole('button', { name: 'Save Configuration' }));

    expect(onUpdate).toHaveBeenCalledTimes(1);
    expect(onUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Atlas V2',
        model: 'gemini-flash',
        maxTokens: 4096,
        tools: expect.arrayContaining(['search', 'debug']),
      }),
    );
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onUpdate when cancelled', async () => {
    const user = userEvent.setup();
    const { onUpdate, onClose } = renderPanel();

    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onUpdate).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes when the backdrop or ✕ button is clicked', async () => {
    const user = userEvent.setup();
    const { onClose } = renderPanel();

    await user.click(screen.getByRole('button', { name: '✕' }));
    expect(onClose).toHaveBeenCalledTimes(1);

    // Backdrop overlay (absolute inset-0 sibling of the dialog card).
    const backdrop = document.querySelector('.bg-black\\/60');
    expect(backdrop).not.toBeNull();
    await user.click(backdrop!);
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('resets the draft when a different agent is opened', async () => {
    const user = userEvent.setup();
    const first = makeAgent({ config: makeConfig({ name: 'First' }) });
    const second = makeAgent({ id: 'agent-2', config: makeConfig({ name: 'Second' }) });
    const { rerender } = render(
      <ConfigPanel agent={first} onUpdate={() => {}} onClose={() => {}} />,
    );

    await user.clear(screen.getByLabelText('Agent Name'));
    await user.type(screen.getByLabelText('Agent Name'), 'Edited');
    expect(screen.getByLabelText('Agent Name')).toHaveValue('Edited');

    rerender(<ConfigPanel agent={second} onUpdate={() => {}} onClose={() => {}} />);
    expect(screen.getByLabelText('Agent Name')).toHaveValue('Second');
  });

  it('updates the temperature label as the slider moves', async () => {
    const user = userEvent.setup();
    renderPanel();
    expect(screen.getByLabelText(/Temperature: 0.5/)).toBeInTheDocument();

    const slider = screen.getByRole('slider');
    await user.clear(slider);
    await user.type(slider, '0.8');
    expect(screen.getByLabelText(/Temperature: 0.8/)).toBeInTheDocument();
  });
});
