class GetDataRepo {
  constructor(container) {
    this.invertedIndex = container.resolve("invertedIndex");
  }

  async getMatchingLines(inputQuery) {
    return new Promise((resolve, reject) => {
      try {
        const response = this.invertedIndex.searchIndex(inputQuery);
        // let freq = [];
        // if (Array.isArray(inputQuery)) {
        //   for (let term of inputQuery) {
        //     const curr = this.invertedIndex.getFrequency(term);
        //     freq.push(curr);
        //   }
        // }

        return resolve(response);
      } catch (err) {
        console.log(err);
        return reject(err);
      }
    });
  }
}
module.exports = GetDataRepo;
