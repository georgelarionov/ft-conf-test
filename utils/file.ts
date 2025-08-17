export const readFile = (file: File): Promise<string> => {
  return new Promise((res, rej) => {
    if (!file) {
      res('');
      return;
    }
    const reader = new FileReader();
    reader.onload = function (event) {
      res(event!.target!.result as string);
    };
    reader.onerror = function (event) {
      rej(event!.target!.error);
    };
    reader.readAsDataURL(file);
  });
};
