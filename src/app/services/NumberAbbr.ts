export function numberToAbbr(num: number): string {
  if (!num) {
    return '-';
  }
  if (num <= 10000) {
    return num.toString();
  } else if (num > 10000 && num <= 100000000) {
    return (num / 10000).toString()
      .slice(0, 6) + '万';
  } else {
    return (num / 100000000).toFixed(2) + '亿';
  }
}
