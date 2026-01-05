import {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
  forwardRef,
  type KeyboardEvent,
  type ChangeEvent,
  type FocusEvent,
} from 'react';
import {
  generateTimeRange,
  filterTimesByInput,
  isValidTime,
  cleanTimeString,
} from './utils/time';
import './styles.css';

export interface TimePickerProps {
  /** Current time value (e.g., "2:30pm") */
  value: string;
  /** Callback when time changes */
  onChange: (time: string) => void;
  /** Minimum selectable time (default: "12:00am") */
  minTime?: string;
  /** Maximum selectable time (default: "11:59pm") */
  maxTime?: string;
  /** Interval between time options in minutes (default: 30) */
  interval?: number;
  /** Show error state */
  error?: boolean;
  /** Error message to display */
  errorMessage?: string;
  /** Input placeholder text */
  placeholder?: string;
  /** Input name attribute */
  name?: string;
  /** Input id attribute */
  id?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Additional CSS class for the container */
  className?: string;
  /** Callback when input loses focus */
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  /** Callback when input gains focus */
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  /** Accessible label for the input */
  'aria-label'?: string;
  /** ID of element that labels the input */
  'aria-labelledby'?: string;
}

/**
 * A lightweight, accessible timepicker component for React
 * with full keyboard navigation and CSS customization.
 */
export const TimePicker = forwardRef<HTMLInputElement, TimePickerProps>(
  (
    {
      value,
      onChange,
      minTime = '12:00am',
      maxTime = '11:59pm',
      interval = 30,
      error = false,
      errorMessage = 'Please enter a valid time',
      placeholder = 'Select time',
      name,
      id,
      disabled = false,
      className = '',
      onBlur,
      onFocus,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [hasInteracted, setHasInteracted] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const internalRef = useRef<HTMLInputElement>(null);

    // Merge refs
    const setRefs = useCallback(
      (node: HTMLInputElement | null) => {
        (internalRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
        }
      },
      [ref]
    );

    // Generate time options (memoized)
    const timeOptions = useMemo(
      () => generateTimeRange(minTime, maxTime, interval),
      [minTime, maxTime, interval]
    );

    // Filter options based on user input
    const filteredOptions = useMemo(() => {
      if (!value || !hasInteracted) return timeOptions;
      return filterTimesByInput(timeOptions, value);
    }, [timeOptions, value, hasInteracted]);

    // Handle click outside to close dropdown
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen]);

    // Scroll highlighted option into view
    useEffect(() => {
      if (isOpen && highlightedIndex >= 0 && listRef.current) {
        const option = listRef.current.children[highlightedIndex] as HTMLElement;
        option?.scrollIntoView?.({ block: 'nearest' });
      }
    }, [isOpen, highlightedIndex]);

    // Reset highlighted index when options change
    useEffect(() => {
      setHighlightedIndex(-1);
    }, [filteredOptions]);

    const handleInputChange = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setHasInteracted(true);
        onChange(newValue);
        if (!isOpen) {
          setIsOpen(true);
        }
      },
      [onChange, isOpen]
    );

    const handleInputFocus = useCallback(
      (event: FocusEvent<HTMLInputElement>) => {
        setIsOpen(true);
        onFocus?.(event);
      },
      [onFocus]
    );

    const handleInputBlur = useCallback(
      (event: FocusEvent<HTMLInputElement>) => {
        // Delay to allow click on option to register
        setTimeout(() => {
          if (!containerRef.current?.contains(document.activeElement)) {
            setIsOpen(false);
            setHasInteracted(false);
          }
        }, 150);
        onBlur?.(event);
      },
      [onBlur]
    );

    const handleOptionSelect = useCallback(
      (time: string) => {
        onChange(time);
        setIsOpen(false);
        setHasInteracted(false);
        internalRef.current?.focus();
      },
      [onChange]
    );

    const handleKeyDown = useCallback(
      (event: KeyboardEvent<HTMLInputElement>) => {
        if (disabled) return;

        switch (event.key) {
          case 'ArrowDown':
            event.preventDefault();
            if (!isOpen) {
              setIsOpen(true);
            } else {
              setHighlightedIndex((prev) =>
                prev < filteredOptions.length - 1 ? prev + 1 : 0
              );
            }
            break;

          case 'ArrowUp':
            event.preventDefault();
            if (!isOpen) {
              setIsOpen(true);
            } else {
              setHighlightedIndex((prev) =>
                prev > 0 ? prev - 1 : filteredOptions.length - 1
              );
            }
            break;

          case 'Enter':
            event.preventDefault();
            if (isOpen && highlightedIndex >= 0) {
              handleOptionSelect(filteredOptions[highlightedIndex]);
            } else if (!isOpen) {
              setIsOpen(true);
            }
            break;

          case 'Escape':
            event.preventDefault();
            setIsOpen(false);
            break;

          case 'Tab':
            setIsOpen(false);
            break;
        }
      },
      [disabled, isOpen, highlightedIndex, filteredOptions, handleOptionSelect]
    );

    const showError =
      error || (hasInteracted && value && !isValidTime(value));
    const listboxId = id ? `${id}-listbox` : 'timepicker-listbox';

    return (
      <div
        ref={containerRef}
        className={`timepicker ${className}`.trim()}
        data-testid="timepicker"
      >
        <input
          ref={setRefs}
          type="text"
          id={id}
          name={name}
          value={cleanTimeString(value)}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls={listboxId}
          aria-activedescendant={
            isOpen && highlightedIndex >= 0
              ? `${listboxId}-option-${highlightedIndex}`
              : undefined
          }
          aria-invalid={showError ? 'true' : undefined}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          className={`timepicker__input ${showError ? 'timepicker__input--error' : ''}`.trim()}
          data-testid="timepicker-input"
        />

        {isOpen && filteredOptions.length > 0 && (
          <ul
            ref={listRef}
            id={listboxId}
            role="listbox"
            className="timepicker__dropdown"
            data-testid="timepicker-dropdown"
          >
            {filteredOptions.map((time, index) => (
              <li
                key={time}
                id={`${listboxId}-option-${index}`}
                role="option"
                aria-selected={highlightedIndex === index}
                className={`timepicker__option ${
                  highlightedIndex === index
                    ? 'timepicker__option--highlighted'
                    : ''
                } ${
                  cleanTimeString(value) === cleanTimeString(time)
                    ? 'timepicker__option--selected'
                    : ''
                }`.trim()}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleOptionSelect(time);
                }}
                onMouseEnter={() => setHighlightedIndex(index)}
                data-testid={`timepicker-option-${index}`}
              >
                {time}
              </li>
            ))}
          </ul>
        )}

        {showError && (
          <div
            className="timepicker__error"
            role="alert"
            data-testid="timepicker-error"
          >
            {errorMessage}
          </div>
        )}
      </div>
    );
  }
);

TimePicker.displayName = 'TimePicker';

// Export utilities for advanced users
export {
  generateTimeRange,
  filterTimesByInput,
  isValidTime,
  cleanTimeString,
  parseTime,
  formatTime,
} from './utils/time';

export type { TimeValue } from './utils/time';
