import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from '../App';
import { defaultAgents } from '../data/agents';

describe('App', () => {
  it('renders the header with title and subtitle', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /Antigravity Agent Lab/ })).toBeInTheDocument();
    expect(
      screen.getByText('from google.antigravity import Agent, LocalAgentConfig'),
    ).toBeInTheDocument();
  });

  it('starts with antigravity ON and shows all default agents', () => {
    render(<App />);
    expect(screen.getByText('ON', { selector: 'span' })).toBeInTheDocument();
    expect(screen.getByText('Zero-G Mode Active')).toBeInTheDocument();
    for (const agent of defaultAgents) {
      expect(screen.getByText(agent.config.name)).toBeInTheDocument();
    }
    // Agent count reflected in the control bar.
    expect(screen.getByText(defaultAgents.length, { selector: 'span' })).toBeInTheDocument();
  });

  it('toggles the antigravity switch and updates the indicator', async () => {
    const user = userEvent.setup();
    render(<App />);

    const toggle = screen.getByRole('button', { pressed: true });
    await user.click(toggle);

    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByText('OFF', { selector: 'span' })).toBeInTheDocument();
    expect(screen.queryByText('Zero-G Mode Active')).not.toBeInTheDocument();
    expect(
      screen.getByText(/Toggle antigravity to see agents float/),
    ).toBeInTheDocument();

    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
  });

  it('increments the launch counter when Launch All is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(screen.getByText('0', { selector: 'span' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Launch All/ }));
    expect(screen.getByText('1', { selector: 'span' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Launch All/ }));
    expect(screen.getByText('2', { selector: 'span' })).toBeInTheDocument();
  });

  it('turns antigravity back on when launching if it was off', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { pressed: true })); // turn OFF
    await user.click(screen.getByRole('button', { name: /Launch All/ }));

    expect(screen.getByRole('button', { pressed: true })).toBeInTheDocument();
    expect(screen.getByText('ON', { selector: 'span' })).toBeInTheDocument();
  });

  it('shows and hides the code preview via the toggle button', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.queryByText(/agent_config\.py/)).not.toBeInTheDocument();

    const codeBtn = screen.getByRole('button', { name: /View Code/ });
    await user.click(codeBtn);
    expect(screen.getByText('agent_config.py')).toBeInTheDocument();
    expect(
      screen.getByText(/from google\.antigravity import Agent, LocalAgentConfig\n\n# Initialize/),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Hide Code/ }));
    expect(screen.queryByText('agent_config.py')).not.toBeInTheDocument();
  });

  it('opens the config panel when an agent card is clicked and closes it on cancel', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByText('Atlas'));
    expect(screen.getByText('LocalAgentConfig')).toBeInTheDocument();
    expect(screen.getByText('Configure Atlas')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByText('LocalAgentConfig')).not.toBeInTheDocument();
  });

  it('persists a saved configuration change into the agent card', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByText('Nova'));
    const nameInput = screen.getByLabelText('Agent Name');
    await user.clear(nameInput);
    await user.type(nameInput, 'Nova Prime');
    await user.click(screen.getByRole('button', { name: 'Save Configuration' }));

    expect(screen.queryByText('LocalAgentConfig')).not.toBeInTheDocument();
    expect(screen.getByText('Nova Prime')).toBeInTheDocument();
    expect(screen.queryByText('Nova')).not.toBeInTheDocument();
  });

  it('renders the three info cards', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Antigravity Mode' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'LocalAgentConfig' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Python API' })).toBeInTheDocument();
  });
});
