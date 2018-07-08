export function toDecimals (number, decimals) {
  /** Truncate a number to a given number of decimals **/
  number = number.toString() // It needs to be a string
  const decimalPointI = number.indexOf('.')
  if (decimalPointI === -1) { // The number has no decimal part
    return number
  }
  const i = decimalPointI + 1
  return number.slice(0, i) + number.substr(i, decimals)
}

export function formatAmount (amount, currency) {
  amount = toDecimals(amount, currency.decimals)
  return `${currency.prefix}${amount} ${currency.postfix}`
}
