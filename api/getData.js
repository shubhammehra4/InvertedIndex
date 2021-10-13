class GetData {
  constructor(container) {
    this.utility = container.resolve("utility");
    this.validate = container.resolve("validate");
    this.getDataRepo = container.resolve("getDataRepo");
  }

  async handleRequest(req, res) {
    let [err, validatedData] = await this.utility.invoker(
      this.validate(req.body, "getData")
    );
    if (err) {
      return this.utility.sendResponse(err, null, res);
    }
    let data;
    [err, data] = await this.utility.invoker(
      this.getDataRepo.getMatchingLines(validatedData.inputQuery)
    );
    return this.utility.sendResponse(null, data, res);
  }
}

module.exports = GetData;
