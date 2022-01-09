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

// repos
const GetBooksRepo = require("../repo/getBooksRepo");
const getBooksRepo = new GetBooksRepo(container);
container.register("getBooksRepo", asValue(getBooksRepo));

const GetBooks = require("../api/getBooks");
const getBooks = new GetBooks(container);

// apis
container.register("getBooks", asValue(getBooks));

module.exports = container;
