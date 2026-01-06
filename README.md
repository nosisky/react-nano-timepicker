# react-nano-timepicker

> A lightweight, accessible timepicker component for React with full keyboard navigation and CSS customization.

[![NPM](https://img.shields.io/npm/v/react-nano-timepicker.svg)](https://www.npmjs.com/package/react-nano-timepicker)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/react-nano-timepicker)](https://bundlephobia.com/package/react-nano-timepicker)
[![License](https://img.shields.io/npm/l/react-nano-timepicker)](https://github.com/nosisky/react-nano-timepicker/blob/main/LICENSE)

## Features

- ⚡ **Zero dependencies** - No moment.js or other bloated libraries
- ♿ **Accessible** - WCAG 2.1 AA compliant with full keyboard navigation
- 🎨 **Customizable** - Style via CSS custom properties
- 📦 **Tiny bundle** - < 5KB minified + gzipped
- 🔧 **TypeScript** - Full type definitions included
- ⚛️ **React 18/19** - Built for modern React

## Installation

```bash
npm install react-nano-timepicker
```

## Quick Start

```tsx
import { useState } from "react";
import { TimePicker } from "react-nano-timepicker";
import "react-nano-timepicker/styles.css";

function App() {
  const [time, setTime] = useState("");

  return (
    <TimePicker
      value={time}
      onChange={setTime}
      minTime="9:00am"
      maxTime="5:00pm"
      interval={30}
    />
  );
}
```

## Props

| Prop           | Type                     | Default                       | Description                         |
| -------------- | ------------------------ | ----------------------------- | ----------------------------------- |
| `value`        | `string`                 | Required                      | Current time value (e.g., "2:30pm") |
| `onChange`     | `(time: string) => void` | Required                      | Callback when time changes          |
| `minTime`      | `string`                 | `"12:00am"`                   | Minimum selectable time             |
| `maxTime`      | `string`                 | `"11:59pm"`                   | Maximum selectable time             |
| `interval`     | `number`                 | `30`                          | Interval between options (minutes)  |
| `error`        | `boolean`                | `false`                       | Show error state                    |
| `errorMessage` | `string`                 | `"Please enter a valid time"` | Error message text                  |
| `placeholder`  | `string`                 | `"Select time"`               | Input placeholder                   |
| `disabled`     | `boolean`                | `false`                       | Disabled state                      |
| `name`         | `string`                 | -                             | Input name attribute                |
| `id`           | `string`                 | -                             | Input id attribute                  |
| `className`    | `string`                 | -                             | Additional CSS class                |
| `aria-label`   | `string`                 | -                             | Accessible label                    |

## Customization

Customize the appearance using CSS custom properties:

```css
.timepicker {
  --timepicker-bg: #1a1a1a;
  --timepicker-text: #ffffff;
  --timepicker-border: #333333;
  --timepicker-border-focus: #0ea5e9;
  --timepicker-hover-bg: #2a2a2a;
  --timepicker-selected-bg: #0ea5e9;
  --timepicker-selected-text: #ffffff;
  --timepicker-error: #f43f5e;
  --timepicker-radius: 8px;
  --timepicker-font-size: 16px;
}
```

### Available CSS Variables

| Variable                           | Description                |
| ---------------------------------- | -------------------------- |
| `--timepicker-bg`                  | Background color           |
| `--timepicker-text`                | Text color                 |
| `--timepicker-text-secondary`      | Placeholder text color     |
| `--timepicker-border`              | Border color               |
| `--timepicker-border-focus`        | Focus border color         |
| `--timepicker-hover-bg`            | Option hover background    |
| `--timepicker-selected-bg`         | Selected option background |
| `--timepicker-selected-text`       | Selected option text color |
| `--timepicker-error`               | Error state color          |
| `--timepicker-radius`              | Border radius              |
| `--timepicker-shadow`              | Dropdown shadow            |
| `--timepicker-font-family`         | Font family                |
| `--timepicker-font-size`           | Font size                  |
| `--timepicker-input-height`        | Input height               |
| `--timepicker-dropdown-max-height` | Max dropdown height        |
| `--timepicker-z-index`             | Dropdown z-index           |

## Keyboard Navigation

| Key      | Action                                  |
| -------- | --------------------------------------- |
| `↓`      | Open dropdown / Move to next option     |
| `↑`      | Open dropdown / Move to previous option |
| `Enter`  | Select highlighted option               |
| `Escape` | Close dropdown                          |
| `Tab`    | Close dropdown and move focus           |

## Utilities

The package also exports utility functions for advanced use cases:

```tsx
import {
  parseTime,
  formatTime,
  generateTimeRange,
  isValidTime,
} from "react-nano-timepicker";

// Parse time string to { hours, minutes }
parseTime("2:30pm"); // { hours: 14, minutes: 30 }

// Format back to string
formatTime({ hours: 14, minutes: 30 }); // "2:30pm"

// Generate time options
generateTimeRange("9:00am", "5:00pm", 60);
// ['9:00am', '10:00am', '11:00am', ...]

// Validate time string
isValidTime("2:30pm"); // true
```

## Demo

Check out the interactive demo: [https://nosisky.github.io/react-nano-timepicker/](https://nosisky.github.io/react-nano-timepicker/)

## Migration

### From react-timepicker-c (v1.x)

- **React 18+ required** - This version requires React 18 or 19
- **CSS import required** - You must import the styles separately: `import "react-nano-timepicker/styles.css"`
- **Prop renames**:
  - `timeValue` → `value`
  - `hasTimeError` → `error`

### From react-timepicker-c (v2.x)

- **Rename only** - Just update your imports from `react-timepicker-c` to `react-nano-timepicker`.

## License

MIT © [nosisky](https://github.com/nosisky)
