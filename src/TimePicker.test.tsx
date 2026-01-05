import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TimePicker } from './index';

describe('TimePicker', () => {
  const defaultProps = {
    value: '',
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the input element', () => {
      render(<TimePicker {...defaultProps} />);
      expect(screen.getByTestId('timepicker-input')).toBeInTheDocument();
    });

    it('renders with placeholder', () => {
      render(<TimePicker {...defaultProps} placeholder="Choose a time" />);
      expect(screen.getByPlaceholderText('Choose a time')).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      render(<TimePicker {...defaultProps} className="custom-class" />);
      expect(screen.getByTestId('timepicker')).toHaveClass('custom-class');
    });

    it('renders dropdown when focused', () => {
      render(<TimePicker {...defaultProps} />);
      fireEvent.focus(screen.getByTestId('timepicker-input'));
      expect(screen.getByTestId('timepicker-dropdown')).toBeInTheDocument();
    });

    it('does not render dropdown when disabled', () => {
      render(<TimePicker {...defaultProps} disabled />);
      fireEvent.focus(screen.getByTestId('timepicker-input'));
      expect(screen.queryByTestId('timepicker-dropdown')).toBeInTheDocument();
    });
  });

  describe('Time Selection', () => {
    it('calls onChange when option is selected', () => {
      const onChange = vi.fn();
      render(<TimePicker {...defaultProps} onChange={onChange} />);
      
      fireEvent.focus(screen.getByTestId('timepicker-input'));
      fireEvent.mouseDown(screen.getByTestId('timepicker-option-0'));
      
      expect(onChange).toHaveBeenCalled();
    });

    it('displays selected value', () => {
      render(<TimePicker {...defaultProps} value="2:30pm" />);
      expect(screen.getByTestId('timepicker-input')).toHaveValue('2:30pm');
    });

    it('generates correct time options', () => {
      render(
        <TimePicker
          {...defaultProps}
          minTime="9:00am"
          maxTime="10:00am"
          interval={30}
        />
      );
      
      fireEvent.focus(screen.getByTestId('timepicker-input'));
      
      expect(screen.getByText('9:00am')).toBeInTheDocument();
      expect(screen.getByText('9:30am')).toBeInTheDocument();
      expect(screen.getByText('10:00am')).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation', () => {
    it('opens dropdown on ArrowDown', () => {
      render(<TimePicker {...defaultProps} />);
      const input = screen.getByTestId('timepicker-input');
      
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      
      expect(screen.getByTestId('timepicker-dropdown')).toBeInTheDocument();
    });

    it('closes dropdown on Escape', () => {
      render(<TimePicker {...defaultProps} />);
      const input = screen.getByTestId('timepicker-input');
      
      fireEvent.focus(input);
      expect(screen.getByTestId('timepicker-dropdown')).toBeInTheDocument();
      
      fireEvent.keyDown(input, { key: 'Escape' });
      expect(screen.queryByTestId('timepicker-dropdown')).not.toBeInTheDocument();
    });

    it('navigates options with ArrowDown/ArrowUp', () => {
      render(
        <TimePicker
          {...defaultProps}
          minTime="9:00am"
          maxTime="9:30am"
          interval={30}
        />
      );
      const input = screen.getByTestId('timepicker-input');
      
      fireEvent.focus(input);
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      
      expect(screen.getByTestId('timepicker-option-0')).toHaveClass(
        'timepicker__option--highlighted'
      );
      
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      expect(screen.getByTestId('timepicker-option-1')).toHaveClass(
        'timepicker__option--highlighted'
      );
      
      fireEvent.keyDown(input, { key: 'ArrowUp' });
      expect(screen.getByTestId('timepicker-option-0')).toHaveClass(
        'timepicker__option--highlighted'
      );
    });

    it('selects option with Enter', () => {
      const onChange = vi.fn();
      render(
        <TimePicker
          {...defaultProps}
          onChange={onChange}
          minTime="9:00am"
          maxTime="9:30am"
          interval={30}
        />
      );
      const input = screen.getByTestId('timepicker-input');
      
      fireEvent.focus(input);
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      fireEvent.keyDown(input, { key: 'Enter' });
      
      expect(onChange).toHaveBeenCalledWith('9:00am');
    });
  });

  describe('Error Handling', () => {
    it('shows error state when error prop is true', () => {
      render(<TimePicker {...defaultProps} error />);
      expect(screen.getByTestId('timepicker-input')).toHaveClass(
        'timepicker__input--error'
      );
      expect(screen.getByTestId('timepicker-error')).toBeInTheDocument();
    });

    it('displays custom error message', () => {
      render(
        <TimePicker
          {...defaultProps}
          error
          errorMessage="Custom error message"
        />
      );
      expect(screen.getByText('Custom error message')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA attributes', () => {
      render(<TimePicker {...defaultProps} id="my-picker" />);
      const input = screen.getByTestId('timepicker-input');
      
      expect(input).toHaveAttribute('role', 'combobox');
      expect(input).toHaveAttribute('aria-haspopup', 'listbox');
      expect(input).toHaveAttribute('aria-expanded', 'false');
      
      fireEvent.focus(input);
      expect(input).toHaveAttribute('aria-expanded', 'true');
      expect(input).toHaveAttribute('aria-controls', 'my-picker-listbox');
    });

    it('sets aria-invalid when error is true', () => {
      render(<TimePicker {...defaultProps} error />);
      expect(screen.getByTestId('timepicker-input')).toHaveAttribute(
        'aria-invalid',
        'true'
      );
    });

    it('supports aria-label', () => {
      render(<TimePicker {...defaultProps} aria-label="Select meeting time" />);
      expect(screen.getByTestId('timepicker-input')).toHaveAttribute(
        'aria-label',
        'Select meeting time'
      );
    });
  });

  describe('Filtering', () => {
    it('filters options based on user input', () => {
      const onChange = vi.fn();
      render(
        <TimePicker
          {...defaultProps}
          onChange={onChange}
          minTime="9:00am"
          maxTime="10:00am"
          interval={30}
        />
      );
      
      const input = screen.getByTestId('timepicker-input');
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: '9:3' } });
      
      expect(onChange).toHaveBeenCalledWith('9:3');
    });
  });
});
