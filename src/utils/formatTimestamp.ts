import moment from 'moment';

export function formatTimestamp(time: number, format = 'YYYY.MM.DD') {
  if (time <= 0) return '--';
  if (!time) return null;
  return moment.unix(time)
    .format(format);
}

export function Timestamp(timestamp: number) {
  const m = moment.unix(timestamp);
  return {
    toJSON() {
      return this.date;
    },

    get date() {
      return m.format('YYYY-MM-DD');
    },

    get dateDash() {
      return m.format('YYYY-MM-DD');
    },

    get dateDot() {
      return m.format('YYYY-MM-DD');
    },

    get datetime() {
      return m.format('YYYY-MM-DD HH:mm:ss');
    },

    get datetimeM() {
      return m.format('YYYY-MM-DD HH:mm');
    },

  };
}
