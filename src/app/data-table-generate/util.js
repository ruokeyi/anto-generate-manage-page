export const transObj = (obj)=>{
  return Object.keys(obj).map(p=>{
    return {
      key:p,
      ...obj[p]
    }
  })
}
export const initParam = (type)=>{
  switch (type) {
    case "String":
      return "";
      break;
    case "Object":
      return {};
      break;
    case "Array":
      return [];
      break;
    case "Boolean":
      return null;
      break;
    default:
      return null;
  }
}