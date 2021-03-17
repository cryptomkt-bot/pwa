import i18n from './locale/i18n';
import StorageHelper from './helpers/StorageHelper';

export function toDecimals(number, decimals) {
  /** Truncate a number to a given number of decimals */
  number = number.toString(); // It needs to be a string
  const decimalPointI = number.indexOf('.');
  if (decimalPointI === -1) {
    // The number has no decimal part
    return number;
  }
  if (decimals === 0) {
    return number.slice(0, decimalPointI);
  }
  const i = decimalPointI + 1;
  return number.slice(0, i) + number.substr(i, decimals);
}

export function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function localeTime(date) {
  return date.toLocaleTimeString(i18n.locale);
}

export function formatAmount(amount, currency, decimals) {
  /** Format a given amount of a currency */
  amount = toDecimals(amount, decimals);
  return `${currency.prefix}${amount} ${currency.postfix}`;
}

export function base64UrlToBase64(base64Url) {
  return base64Url.replace(/-/g, '+').replace(/_/g, '/');
}

export function base64ToArrayBuffer(base64) {
  const binaryString = atob(base64);
  const length = binaryString.length;
  const bytes = new Uint8Array(length);
  for (var i = 0; i < length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

export function base64UrlToArrayBuffer(base64Url) {
  const base64 = base64UrlToBase64(base64Url);
  return base64ToArrayBuffer(base64);
}

export async function unlock() {
  const credential = StorageHelper.get('credential');
  if (!credential) {
    return;
  }

  const id = base64UrlToArrayBuffer(credential.id);

  return navigator.credentials.get({
    publicKey: {
      allowCredentials: [
        {
          id,
          type: credential.type,
          transports: ['internal'],
        },
      ],
      challenge: new ArrayBuffer(),
    },
  });
}
