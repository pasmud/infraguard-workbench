import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ComplianceBadge from '../src/components/ComplianceBadge';

describe('ComplianceBadge', () => {
  it('renders CIS badge', () => {
    render(<ComplianceBadge complianceId="CIS-3.3" />);
    expect(screen.getByText('CIS-3.3')).toBeDefined();
  });

  it('renders NIST badge', () => {
    render(<ComplianceBadge complianceId="NIST-SC-4" />);
    expect(screen.getByText('NIST-SC-4')).toBeDefined();
  });

  it('renders PCI badge', () => {
    render(<ComplianceBadge complianceId="PCI-1.2" />);
    expect(screen.getByText('PCI-1.2')).toBeDefined();
  });
});
