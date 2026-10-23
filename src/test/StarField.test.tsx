import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import StarField from '../components/StarField';

describe('StarField', () => {
  it('renders 80 star elements inside a fixed decorative layer', () => {
    const { container } = render(<StarField />);
    const layer = container.firstElementChild;
    expect(layer).toHaveClass('fixed', 'pointer-events-none');
    // Stars are absolutely-positioned white rounded divs.
    const stars = layer!.querySelectorAll('div.absolute.rounded-full.bg-white');
    expect(stars).toHaveLength(80);
  });

  it('keeps star positions stable across re-renders (memoized)', () => {
    const { container, rerender } = render(<StarField />);
    const first = [...container.querySelectorAll('div[style*="left"]')].map((el) =>
      (el as HTMLElement).style.left,
    );

    rerender(<StarField />);
    const second = [...container.querySelectorAll('div[style*="left"]')].map((el) =>
      (el as HTMLElement).style.left,
    );

    expect(second).toEqual(first);
  });

  it('positions every star within the viewport percentages', () => {
    const { container } = render(<StarField />);
    const stars = container.querySelectorAll('div[style*="left"]');
    for (const star of Array.from(stars)) {
      const el = star as HTMLElement;
      const left = parseFloat(el.style.left);
      const top = parseFloat(el.style.top);
      expect(left).toBeGreaterThanOrEqual(0);
      expect(left).toBeLessThan(100);
      expect(top).toBeGreaterThanOrEqual(0);
      expect(top).toBeLessThan(100);
      expect(parseFloat(el.style.width)).toBeGreaterThan(0);
    }
  });
});
