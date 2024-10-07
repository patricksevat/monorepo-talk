type Severity = 'info' | 'warn' | 'error';

export function logger(message: string, severity?: Severity): void {
  const logMethod = severity ? console[severity] : console.log;
  logMethod(message);
}

