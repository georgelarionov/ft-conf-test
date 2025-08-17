export const fetchMock = (data: any, time = 1000) =>
  new Promise(res => {
    setTimeout(() => {
      res(data);
    }, time);
  });
