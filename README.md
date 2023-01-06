# react-timepicker-c

> A simple timepicker component for ReactJS also supports custom time input

[![NPM](https://img.shields.io/npm/v/react-timepicker-c.svg)](https://www.npmjs.com/package/react-timepicker-c) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)


### [Demo](https://nosisky.github.io/react-timepicker-c/)

## Install

```bash
npm install --save react-timepicker-c
```

## Usage

```tsx
import * as React from 'react'

import TimePicker from 'react-timepicker-c'

class Example extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      timeValue: ''
    }
  }

  handleTimeChange = (timeValue) => {
    this.setState({
      timeValue
    })
  } 

  render () {
    return (
        <TimePicker
          minTime = '1:00am'
          maxTime =  '4:30pm'
          onChange={this.handleTimeChange}
          timeValue={this.state.timeValue}
          name="timeField"
        />
    )
  }
}
```


## Props

Common props you may want to specify include:

- `name` - generate an HTML input with this name, containing the current value (optional)
- `onChange` - subscribe to change events
- `minTime` - specify the starting time e.g 1:00am (optional)
- `maxTime` - specify the maximum time e.g 5:00pm (optional)
- `timeValue` - control the current value
- `hasTimeError` - boolean value to handle custom error validation (optional)
- `interval` - specify the interval between the time options e.g 30 - will represent 30 mins (optional)

## Controllable Props

You can control the following props by providing values for them. If you don't, React-timepicker-c will manage them for you.

- `timeValue` / `onChange` - specify the current value of the control

If you don't provide these props, you can set the initial value of the state they control:

## Methods

React-timepicker-c exposes a public method:

- `onChange()` - Subscribe to change events.


## License

MIT © [nosisky](https://github.com/nosisky)
