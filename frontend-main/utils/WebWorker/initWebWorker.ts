import { worker } from 'pages/_app';
import { WorkerPayload } from 'type';

export const initWebWorker = worker => {
  if (typeof window === 'undefined') return {};
  const code = worker.toString();
  const blob = new Blob(['(' + code + ')()']);
  return new Worker(URL.createObjectURL(blob));
};

export const eventHandler =
  (eventName: string, callback: (data: any) => void) =>
  ({ data }: { data: WorkerPayload }) => {
    if (data.event !== eventName) return;
    const { data: payload } = data;
    callback(payload);
  };

export const emitEvent = (eventName: string, data: any) => {
  worker.postMessage({
    event: eventName,
    data,
  } as WorkerPayload);
};
