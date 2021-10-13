const invoker = (promise) => {
  return promise
    .then((data) => {
      return [null, data];
    })
    .catch((err) => {
      return [err, null];
    });
};

const sendResponse = (err, data, res) => {
  if (err) {
    return res.send(err);
  }
  res.status(200);
  return res.send(data);
};

module.exports = { invoker, sendResponse };
