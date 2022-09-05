import moment from 'moment'
import { stringify } from 'qs'
export function sleep(time = 20) {
  return new Promise(resolve1 => setTimeout(resolve1, time))
}
export function translateForm(json) {
  return stringify(json)
}
export function formatNumber(value, currency, decimals) {
  value = parseFloat(value)
  if (!isFinite(value) || (!value && value !== 0)) return ''
  currency = currency != null ? currency : '￥'
  decimals = decimals != null ? decimals : 2
  var stringified = Math.abs(value).toFixed(decimals)
  var _int = decimals ? stringified.slice(0, -1 - decimals) : stringified
  var i = _int.length % 3
  var head = i > 0 ? (_int.slice(0, i) + (_int.length > 3 ? ',' : '')) : ''
  var _float = decimals ? stringified.slice(-1 - decimals) : ''
  var sign = value < 0 ? '-' : ''
  return sign + currency + head + _int.slice(i).replace(/(\d{3})(?=\d)/g, '$1,') + _float
}
export function isEmpty(val){
    if(val==='' || val==='undefined'||val===null||val===undefined){
        return true
    }else{
        return false
    } 
}

export function formatTimestamp(timestamp, format = 'YYYY-MM-DD') {
    if(!timestamp) return ''
    return moment.unix(timestamp).format(format)
}

export function numberTo10kUnit(number) {
    let isLessThan0 = number < 0;
    number = Math.abs(number);
    let numAsStr = (number + '').split('');
    let len = numAsStr.length;
    let count = ~~((len - 1) / 4);
    if (count <= 0) return (isLessThan0 ? '-' : '') + number + '';
    let unit = ['', '万', '亿', '万亿'][count];
    return (((isLessThan0 ? '-' : '')
        + ((number / Math.pow(10000, count))).toFixed(1))
        + unit);
}

//将时间转化为时间戳
export function dateToMs(date) {
    let result = new Date(date).getTime();
    return result;
}

export function maxStringLength(str, withLength) {
    if (str.length > withLength) {
      return str.slice(0, withLength-1) + '...';
    }
    return str;
}

export function handleFileDownload(data, fileName) {
  let file = data
  let url = window.URL || window.webkitURL;
  let fileURL = url.createObjectURL(file);
  let a = document.createElement("a");
  a.href = fileURL;
  a.download = fileName;
  a.target = "_self";
  a.click();
  url.revokeObjectURL(fileURL);
}