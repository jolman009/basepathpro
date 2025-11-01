import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { test, expect } from 'vitest';
import AnnotationCanvas from '../../../features/analyze/components/AnnotationCanvas';

test('renders canvas placeholder', () => {
  const { getByText } = render(<AnnotationCanvas />);
  expect(getByText(/Annotation canvas placeholder/i)).toBeInTheDocument();
});
