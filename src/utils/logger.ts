export default {
  info(message: any, ...optionalParams: any[]) {
    window.console.info(message, ...optionalParams);
  },
  warn(message: any, ...optionalParams: any[]) {
    window.console.warn(message, ...optionalParams);
  },
  error(name: string, ...optionalParams: any[]) {
    window.console.error(name, ...optionalParams);
  },
};
