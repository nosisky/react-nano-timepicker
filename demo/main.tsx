import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { TimePicker } from '../src/index';
import '../src/styles.css';

function App() {
  const [time1, setTime1] = useState('');
  const [time2, setTime2] = useState('2:30pm');
  const [time3, setTime3] = useState('');

  return (
    <>
      {/* Default Theme */}
      <div className="demo-section">
        <h2>Default Theme</h2>
        <TimePicker
          value={time1}
          onChange={setTime1}
          placeholder="Pick a time..."
          minTime="9:00am"
          maxTime="6:00pm"
          interval={30}
        />
        <p className="selected-value">
          Selected: <strong>{time1 || 'None'}</strong>
        </p>
      </div>

      {/* With Pre-selected Value */}
      <div className="demo-section">
        <h2>Pre-selected Value (15-min intervals)</h2>
        <TimePicker
          value={time2}
          onChange={setTime2}
          minTime="12:00am"
          maxTime="11:59pm"
          interval={15}
        />
        <p className="selected-value">
          Selected: <strong>{time2 || 'None'}</strong>
        </p>
      </div>

      {/* Dark Theme */}
      <div className="demo-section dark-theme">
        <h2>Dark Theme (CSS Variables)</h2>
        <TimePicker
          value={time3}
          onChange={setTime3}
          placeholder="Select meeting time"
          minTime="8:00am"
          maxTime="10:00pm"
          interval={30}
          aria-label="Meeting time selector"
        />
        <p className="selected-value">
          Selected: <strong>{time3 || 'None'}</strong>
        </p>
      </div>

      {/* Error State */}
      <div className="demo-section">
        <h2>Error State</h2>
        <TimePicker
          value="invalid"
          onChange={() => {}}
          error
          errorMessage="Please select a valid time"
        />
      </div>
    </>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
