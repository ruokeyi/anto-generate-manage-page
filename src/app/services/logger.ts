let empty = (...args) => undefined;

let performanceLogVisible = (...args) => console.warn(
  `%c[${(performance.now() / 1000).toFixed(2)}s]`.padEnd(10),
  'color: orange',
  ...args,
);


export let createLogger = (moduleName = '', color = 'orange') =>
  console.log.bind(console, `%c[${moduleName}]`.padEnd(15), `color:${color}`);

export let performanceLog = empty;
