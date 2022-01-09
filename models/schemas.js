const joi = require("joi");
module.exports = {
  getBooks: joi
    .object()
    .keys({
      inputQuery: joi.string().required(),
    })
    .unknown(true),
};
