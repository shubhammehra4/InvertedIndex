const { createContainer, asValue } = require("awilix");

let container = createContainer();

const InvertedIndex = require("../invertedIndex");
const invertedIndex = new InvertedIndex();

container.register("invertedIndex", asValue(invertedIndex));

const utility = require("../utility");
const { validate } = require("../models/validation");

// utils
container.register("utility", asValue(utility));
container.register("validate", asValue(validate));

const GetDataRepo = require("../repo/getDataRepo");
const getDataRepo = new GetDataRepo(container);

// repos
container.register("getDataRepo", asValue(getDataRepo));

const GetData = require("../api/getData");
const getData = new GetData(container);
// apis
container.register("getData", asValue(getData));

module.exports = container;
