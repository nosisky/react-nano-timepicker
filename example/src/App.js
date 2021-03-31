import React, { Component } from 'react'
import TimePicker from 'react-timepicker-c'

export default class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      hasTimeError: false,
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
          interval={10}
          onChange={this.handleTimeChange}
          timeValue={this.state.timeValue}
          hasTimeError={this.state.hasTimeError}
          name="timeField"
        />
    )
  }
}
