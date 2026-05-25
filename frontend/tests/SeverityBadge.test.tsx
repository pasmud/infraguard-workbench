import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SeverityBadge from '../src/components/SeverityBadge';

describe('SeverityBadge', () => {
  it('renders with correct text', () => {
    render(<SeverityBadge severity="CRITICAL" />);
    expect(screen.getByText('CRITICAL')).toBeDefined();
  });

  it('renders HIGH severity', () => {
    render(<SeverityBadge severity="HIGH" />);
    expect(screen.getByText('HIGH')).toBeDefined();
  });

  it('renders MEDIUM severity', () => {
    render(<SeverityBadge severity="MEDIUM" />);
    expect(screen.getByText('MEDIUM')).toBeDefined();
  });

  it('renders LOW severity', () => {
    render(<SeverityBadge severity="LOW" />);
    expect(screen.getByText('LOW')).toBeDefined();
  });
});
