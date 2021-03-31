import  moment from 'moment';

export const cleanTime = (time: string): string => {
  return time.toLowerCase().replace(/[\s]/g, '');
};

export const filterTimesByUserInput = (
  times: string[],
  targetTime: string
): string[] => {
  let target = targetTime.toLowerCase().replace(/[\s]/g, '');

  return times
    .map(time => time.toLowerCase().replace(/[\s]/g, ''))
    .filter(time => time.includes(target));
};

export const generateTimesInRange = (
  fromTime: string,
  toTime: string,
  interval: number
): string[] => {
  const start = moment(fromTime.replace(/[\s]/g, ''), 'h:mma', true);
  const end = moment(toTime.replace(/[\s]/g, ''), 'h:mma', true);

  if (!start.isValid() || !end.isValid() || start.isAfter(end)) {
    return [];
  }

  let times = [];
  let current = start;
  while (current.isSameOrBefore(end)) {
    times.push(current.format('h:mma'));
    current = moment(current, 'h:mma').add(interval, 'minutes');
  }

  return times;
};


export const isValidTime = (time: string) =>
  moment(time.replace(/[\s]/g, ''), 'h:mma', true).isValid();
