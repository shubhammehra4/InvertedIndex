class GetData {
  constructor(container) {
    this.utility = container.resolve("utility");
    this.validate = container.resolve("validate");
    this.getBooksRepo = container.resolve("getBooksRepo");
  }

  async handleSearchRequest(req, res) {
    let [err, validatedData] = await this.utility.invoker(
      this.validate(req.query, "getBooks")
    );
    if (err) {
      return this.utility.sendResponse(err, null, res);
    }
    let data;
    [err, data] = await this.utility.invoker(
      this.getBooksRepo.getBooks(validatedData.inputQuery)
    );
    return this.utility.sendResponse(null, data, res);
  }

  async handleSuggestionsRequest(req, res) {
    let [err, validatedData] = await this.utility.invoker(
      this.validate(req.query, "getBooks")
    );
    if (err) {
      return this.utility.sendResponse(err, null, res);
    }
    let data;
    [err, data] = await this.utility.invoker(
      this.getBooksRepo.getSearchSuggestions(validatedData.inputQuery)
    );
    return this.utility.sendResponse(null, data, res);
  }
}

module.exports = GetData;
