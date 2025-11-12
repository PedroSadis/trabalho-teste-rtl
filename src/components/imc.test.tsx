import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';

import IMC from './imc';

describe('IMC component', () => {
  it('renders inputs and button', () => {});

  it('renders inputs and button', () => {
    render(<IMC />);
    expect(screen.getByLabelText(/Peso/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Altura/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Calcular IMC/i })).toBeInTheDocument();
  });

  it('shows "Abaixo do peso" for IMC < 18.5 and formats to two decimals', async () => {
    const user = userEvent.setup();
    render(<IMC />);

    await user.type(screen.getByLabelText(/Peso/i), '45');
    await user.type(screen.getByLabelText(/Altura/i), '1.7');
    await user.click(screen.getByRole('button', { name: /Calcular IMC/i }));

    expect(await screen.findByText(/Seu IMC é 15\.57 - Abaixo do peso/)).toBeInTheDocument();
  });

  it('classifies Peso normal correctly', async () => {
    const user = userEvent.setup();
    render(<IMC />);
    await user.type(screen.getByLabelText(/Peso/i), '70');
    await user.type(screen.getByLabelText(/Altura/i), '1.75');
    await user.click(screen.getByRole('button', { name: /Calcular IMC/i }));
    expect(await screen.findByText(/Peso normal/)).toBeInTheDocument();
  });

  it('classifies Sobrepeso correctly', async () => {
    const user = userEvent.setup();
    render(<IMC />);
    await user.type(screen.getByLabelText(/Peso/i), '80');
    await user.type(screen.getByLabelText(/Altura/i), '1.7');
    await user.click(screen.getByRole('button', { name: /Calcular IMC/i }));
    expect(await screen.findByText(/Sobrepeso/)).toBeInTheDocument();
  });

  it('classifies Obesidade grau I correctly', async () => {
    const user = userEvent.setup();
    render(<IMC />);
    await user.type(screen.getByLabelText(/Peso/i), '95');
    await user.type(screen.getByLabelText(/Altura/i), '1.7');
    await user.click(screen.getByRole('button', { name: /Calcular IMC/i }));
    expect(await screen.findByText(/Obesidade grau I/)).toBeInTheDocument();
  });

  it('shows Obesidade grau III for very high IMC', async () => {
    const user = userEvent.setup();
    render(<IMC />);

    await user.type(screen.getByLabelText(/Peso/i), '130');
    await user.type(screen.getByLabelText(/Altura/i), '1.6');
    await user.click(screen.getByRole('button', { name: /Calcular IMC/i }));

    expect(await screen.findByText(/Obesidade grau III/)).toBeInTheDocument();
  });

  it('shows error when peso is non-positive', async () => {
    const user = userEvent.setup();
    render(<IMC />);

    await user.type(screen.getByLabelText(/Peso/i), '0');
    await user.type(screen.getByLabelText(/Altura/i), '1.7');
    await user.click(screen.getByRole('button', { name: /Calcular IMC/i }));

    expect(await screen.findByText(/O peso deve ser um valor positivo/)).toBeInTheDocument();
  });

  it('shows error when altura is non-positive', async () => {
    const user = userEvent.setup();
    render(<IMC />);

    await user.type(screen.getByLabelText(/Peso/i), '70');
    await user.type(screen.getByLabelText(/Altura/i), '0');
    await user.click(screen.getByRole('button', { name: /Calcular IMC/i }));

    expect(await screen.findByText(/A altura deve ser um valor positivo/)).toBeInTheDocument();
  });
});