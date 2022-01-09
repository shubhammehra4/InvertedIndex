class GetDataRepo {
  constructor(container) {
    this.invertedIndex = container.resolve("invertedIndex");
  }

  async getBooks(inputQuery) {
    return new Promise((resolve, reject) => {
      try {
        const response = this.invertedIndex.searchIndex(inputQuery);

        return resolve(response);
      } catch (err) {
        console.error(err);
        return reject(err);
      }
    });
  }

  async getSearchSuggestions(inputQuery) {
    return new Promise((resolve, reject) => {
      try {
        const response = this.invertedIndex.getSuggestions(inputQuery);

        return resolve(response);
      } catch (err) {
        console.error(err);
        return reject(err);
      }
    });
  }
}
module.exports = GetDataRepo;
