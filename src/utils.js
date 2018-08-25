import i18n from './locale/i18n';

export function toDecimals(number, decimals) {
  /** Truncate a number to a given number of decimals */
  number = number.toString(); // It needs to be a string
  const decimalPointI = number.indexOf('.');
  if (decimalPointI === -1) { // The number has no decimal part
    return number;
  }
  if (decimals === 0) {
    return number.slice(0, decimalPointI);
  }
  const i = decimalPointI + 1;
  return number.slice(0, i) + number.substr(i, decimals);
}

export function localeTime(date) {
  return date.toLocaleTimeString(i18n.locale);
}

export function formatAmount(amount, currency, decimals) {
  /** Format a given amount of a currency */
  amount = toDecimals(amount, decimals);
  return `${currency.prefix}${amount} ${currency.postfix}`;
}
