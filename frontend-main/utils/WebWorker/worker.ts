export const worker = () => {
  self.addEventListener('message', e => {
    self.postMessage(e.data, null as any);
  });
};
