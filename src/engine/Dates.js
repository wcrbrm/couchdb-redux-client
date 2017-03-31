import * as moment from 'moment';

const today = moment.unix(moment.now() / 1000);

export const getFuturePeriods = () => {
  const list = {
    7: 'Next and Past 7 days',
    14: 'Next and Past 14 days',
    today: 'Today',
    p5: 'Next 7 days',
    p15: 'Next 14 days',
    p30: 'Next 30 days'
  };
  const prevYear = today.clone().add(-1, 'years').format('YYYY');
  const thisYear = today.format('YYYY');
  const nextYear = today.clone().add(1, 'years').format('YYYY');
  list[`year${prevYear}`] = prevYear;
  list[`year${thisYear}`] = thisYear;
  list[`year${nextYear}`] = nextYear;
  return list;
};

export const getDaysFromPeriod = (period) => {
  /* eslint-disable eqeqeq */
  const list = [];
  if (period === 'today') {
    list.push(today.format('YYYY-MM-DD'));
  } else if (period == parseInt(period, 10)) {
    const days = parseInt(period, 10);
    for (let i1 = days; i1 > -days; i1--) {
      list.push(today.clone().add(i1, 'days').format('YYYY-MM-DD'));
    }
  } else if (period.substring(0, 4) === 'year') {
    const year = parseInt(period.substring(4), 10);
    const dt = new Date();
    dt.setFullYear(year);
    dt.setMonth(11);
    dt.setDate(31);
    const day = moment.unix(dt.getTime() / 1000);
    let di = 365;
    while (parseInt(day.format('YYYY'), 10) === year) {
      list.push(day.format('YYYY-MM-DD'));
      day.add(-1, 'day');
      di--;
    }
  } else if (period.substring(0, 1) === 'p') {
    const days = parseInt(period.substring(1), 10);
    if (period.substring(1) == days) {
      for (let i2 = days + 1; i2 >= 0; i2--) {
        list.push(today.clone().add(i2, 'days').format('YYYY-MM-DD'));
      }
    }
  }
  return list;
};

// helper to map data into map with keys, equal to date
export const keyFromIsoDate = (field) => {
  return (obj, index) => (obj[field].substring(0, 10));
};

export const niceDate = (date) => {
  const m = moment.utc(date);
  const month = m.format('MMM');
  const day = parseInt(m.format('DD'), 10);
  const suffix = m.format('YYYY') === today.format('YYYY') ? '' : `, '${m.format('YY')}`;
  const dayOfWeek = m.format('ddd');
  return `${month} ${day}${suffix}, ${dayOfWeek}`;
};

export const isFuture = (iso) => {
  const now = moment.unix(moment.now() / 1000).format('YYYY-MM-DDTHH:mm:ss');
  return (now < iso);
};

export const isToday = (obj) => {
  // can be improved
  return today.format('YYYY-MM-DD') === obj;
};

export const isHoliday = (obj) => {
  const dayOfWeek = moment.utc(obj).format('ddd');
  return dayOfWeek === 'Sun' || dayOfWeek === 'Sat';
};

export default {
  getFuturePeriods,
  getDaysFromPeriod,
  keyFromIsoDate,
  niceDate,
  isToday,
  isHoliday,
  isFuture
};
