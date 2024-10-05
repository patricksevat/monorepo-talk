type Severity = 'info' | 'warn' | 'error';

type LoggerOptions = {
  message: string;
  severity: Severity;
  app?: string;
  page?: string;
};

function logger_before(message: string, severity: Severity = 'info'): void {
  const logMethod = console[severity] || console.log;
  logMethod(message);
}

// Next, add some additional functionality so we can spot which page/app this message is coming from.
// However 3 args might be a bit much, so let's create an options object instead.
function logger_after({ message, severity, page, app }: LoggerOptions): void {
  const logMethod = console[severity];
  logMethod(`[${app || 'unknown' }: ${page || 'unknown'}]: ${message}`);
}

export const logger = logger_before;
