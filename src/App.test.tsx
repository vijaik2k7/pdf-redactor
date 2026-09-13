import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  it('renders branding title PDFRedact', () => {
    render(<App />);
    expect(screen.getByText('PDFRedact')).toBeDefined();
  });
});
