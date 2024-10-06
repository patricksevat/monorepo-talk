type Severity = 'info' | 'warn' | 'error';

function loggerBefore(message: string, severity?: Severity): void {
  const logMethod = severity ? console[severity] : console.log;
  logMethod(message);
}

function loggerAfter(message: string, severity: Severity, appName = ''): void {
  const logMethod = console[severity];
  logMethod(`[${appName}]: ${message}`);
}

export const logger = loggerAfter;
