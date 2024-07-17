export function getDateStringByTimestamp(timestamp, precision = 'second') {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = fillStartZero(date.getMonth() + 1, 2);
  const d = fillStartZero(date.getDate(), 2);
  const hour = fillStartZero(date.getHours(), 2);
  const min = fillStartZero(date.getMinutes(), 2);
  const s = fillStartZero(date.getSeconds(), 2);

  switch (precision) {
    case 'second':
      return `${year}-${month}-${d} ${hour}:${min}:${s}`;
    case 'minute':
      return `${year}-${month}-${d} ${hour}:${min}`;
    case 'date':
      return `${year}-${month}-${d}`;
    case 'nodate':
      return `${hour}:${min}:${s}`;
    case 'nodate-minute':
      return `${hour}:${min}`;
  }
}

export function fillStartZero(value, maxLength) {
  return `${value}`.padStart(maxLength, '0');
}
