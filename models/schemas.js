const joi = require("joi");
module.exports = {
  getData: joi
    .object()
    .keys({
      inputQuery: joi.string().required(),
    })
    .unknown(true),
};
