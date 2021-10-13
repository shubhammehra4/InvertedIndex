const schemas = require("./schemas");

const validate = (body, type) => {
  return new Promise(async (resolve, reject) => {
    if (!body || !type) {
      return reject("Input or Schema Missing");
    }
    const { err, value } = schemas[type].validate(body);
    if (err) {
      return reject("Invalid Input");
    }
    return resolve(value);
  });
};

module.exports = { validate };
