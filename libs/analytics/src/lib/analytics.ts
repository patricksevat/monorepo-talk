import { fakeFetch, throttle } from "./utils";

export type AnalyticsEvent = {
  app: string;
  action: string;
  label?: string;
  value?: number;
  url?: string;
};

let eventStack: AnalyticsEvent[] = [];

export function trackClick(event: AnalyticsEvent): void {
  eventStack.push(event);
  throttledSendEvents();
}

async function _fakeSendEvents(): Promise<undefined> {
  if(eventStack.length === 0) return;

  await fakeFetch(eventStack);
  eventStack = [];
}

const throttledSendEvents = throttle(_fakeSendEvents, 1000);