/**
 * 主要目的是是让控制台少一些warning
 */
const consoleConf = () => {
  const warn = console.warn
  console.warn = (...args: Array<any>) => {
    const blackList = [
      'binding value must be a string',
      '<TransitionGroup> children must be keyed',
      'Expected Date, Array, String'
    ] // warning黑名单，包含这些不打印
    for (let blackStr of blackList) {
      if (args[0] && args[0].toString().includes(blackStr)) return
    }
    warn(...args, '\n', (new Error()).stack?.split('\n')[2].trim())
  }
}

consoleConf()
