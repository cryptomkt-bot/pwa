import i18n from './locale/i18n';
import { capitalize, localeTime, toDecimals } from './utils';

export default {
  capitalize,
  toDecimals,
  localeTime,
  date: timestamp => {
    const date = new Date(timestamp);
    return date.toLocaleString(i18n.locale, {
      day: 'numeric',
      month: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  },
};
