import * as React from 'react';
import {
  generateTimesInRange,
  filterTimesByUserInput,
  cleanTime,
  isValidTime
} from './utils/validation';

import styled, { css } from 'styled-components';


export interface Props {
  timeValue: string;
  onChange: (time: string) => void;
  minTime?: string;
  maxTime?: string;
  hasTimeError?: boolean;
  interval?: number;
  name?: string;
}

interface State {
  isMenuOpen: boolean;
  hasError: boolean;
  hasUserInput: boolean;
}

const overlay = css`
    background-color: #fff;
    border: none;
    border-radius: 3px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.1);
`;


const StyledInput = styled.input`
  margin-bottom: 0;
  width: 100%;
  height: 20px;
  color: rgb(86, 86, 86);
  outline: none;
  padding: 12px;
  border-width: 1px;
  border-style: solid;
  border-color: rgb(221, 221, 221);
  border-image: initial;
  border-radius: 3px;
  font: 14px ProximaNovaRegular, "Helvetica Neue", Helvetica, Arial, sans-serif;
`;

const TimeWrapper = styled.div`
  overflow-y: auto;
  max-height: 210px;
  width: 100%;
  background: #fff;
  border: 1px solid #fff;
  -webkit-box-shadow: ${overlay};
  -moz-box-shadow: ${overlay};
  box-shadow: ${overlay};
  outline: none;
  margin: 0;
  position: absolute;
`;

const Container = styled.div`
  position: relative;
  max-height: 44px;
`;

const TimeMenu = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const TimeList = styled.li`
  padding: 12px;
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;
  color: #565656;
  list-style: none;
  margin: 0;
  &:hover {
    background-color: #808080;
    color: #fff;
  }
`;

const Error = styled.div`
  font: 14px 'ProximaNovaBold', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  color: #C3543E;
`;

class TimeSelectField extends React.Component<Props, State> {
  private readonly timeOptions: string[];

  public static defaultProps = {
    minTime: '12:00am',
    maxTime: '11:30pm',
    interval: 30
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      isMenuOpen: false,
      hasError: false,
      hasUserInput: false
    };

    this.timeOptions = generateTimesInRange(
      this.props.minTime!,
      this.props.maxTime!,
      this.props.interval!
    );

    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleTimeInputChange = this.handleTimeInputChange.bind(this);
    this.handleOptionSelect = this.handleOptionSelect.bind(this);
  }

  public handleFocus() {
    this.setState({
      isMenuOpen: true
    });
  }

  public handleTimeInputChange(e: any) {
    if (e.target.value.length) {
      this.setState({
        hasUserInput: true
      });
    }
    this.props.onChange(e.target.value);
  }

  public handleBlur() {
    const hasError = !isValidTime!(this.props.timeValue);

    this.setState({
      isMenuOpen: false,
      hasError,
      hasUserInput: false
    });
  }

  public handleOptionSelect(
    event: React.MouseEvent<HTMLLIElement, MouseEvent>
  ) {
    const userInput =
      (event.currentTarget.dataset && event.currentTarget.dataset.time) || '';

    this.setState({
      isMenuOpen: false,
      hasError: false
    });

    this.props.onChange(userInput);
  }

  render() {
    const { hasError, isMenuOpen, hasUserInput } = this.state;

    const timeOptionsRendered = hasUserInput
      ? filterTimesByUserInput(this.timeOptions, this.props.timeValue)
      : this.timeOptions;

    const timeValue = cleanTime(this.props.timeValue);
    const isError = hasError || this.props.hasTimeError;

    const borderStyle = {
      borderColor: `${isError ? `#C3543E` : ''}`
    };

    return (
      <Container id="timepickerContainer">
        <StyledInput
          id="timepickerInput"
          name={this.props.name}
          value={timeValue}
          onFocus={this.handleFocus}
          onChange={this.handleTimeInputChange}
          onBlur={this.handleBlur}
          placeholder="Select time"
          autoComplete="off"
          style={borderStyle}
        />
        {isMenuOpen && (
          <TimeWrapper id="timepickerList">
            <TimeMenu id="timeOptions">
              {timeOptionsRendered.map((time, i) => {
                return (
                  <TimeList
                    id="timepickerListItems"
                    key={`time-list-item-${i}`}
                    onMouseDown={this.handleOptionSelect}
                    data-time={time}
                  >
                    {time}
                  </TimeList>
                );
              })}
            </TimeMenu>
          </TimeWrapper>
        )}
     {isError && (
        <Error id="timepickerError">Select a valid time</Error>
      )}
      </Container>
    );
  }
}

export default TimeSelectField;
