export function numberToCurrencyText(num: number) {
  if (num == null) return '';
  let [int, float] = num.toString()
    .split('.');
  let txt = '';
  while (int.length > 0) {
    let next = int.slice(-3);
    int = int.slice(0, -3);
    if (next) {
      txt = `${next},${txt}`;
    }
  }
  return txt.slice(0, -1);
}
