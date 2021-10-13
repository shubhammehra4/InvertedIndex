const fs = require("fs");
const natural = require("natural");
const path = require("path");

/**
 * Class to create and access Inverted Index
 */
class InvertedIndex {
  constructor() {
    const filePath = path.join(__dirname, "./dataset.json");
    const rawFile = fs.readFileSync(filePath, "utf-8");
    const file = JSON.parse(rawFile);
    const books = file.map(({ title, author }) => ({ title, author }));

    this.doc = file;
    this.books = books;
    this.optimize(this.books);
  }

  /**
   * Optimization Function, Creates Optimized Inverted Index
   * @param {[{title:string, author:string}]} books
   */
  optimize(books) {
    this.invertedIndexObject = {};

    books.forEach((book, idx) => {
      let indexString = (book.title + book.author)
        .toLowerCase()
        .replace(/\W+/g, " ")
        .trim();

      this.doStemming(indexString).reduce((acc, word, wordIdx) => {
        if (word in acc) {
          acc[word].push([idx, wordIdx]);
          return acc;
        }

        acc[word] = [[idx, wordIdx]];
        return acc;
      }, this.invertedIndexObject);
    });
  }

  /**
   * Does Stemming
   * @param {string} data
   * @returns {string[]}
   */
  doStemming(data) {
    const tokenizer = new natural.WordTokenizer();
    return tokenizer
      .tokenize(data)
      .map((data) => natural.PorterStemmer.stem(data));
  }

  /**
   * This function returns the Created Index
   * @returns {{}} invertedIndexObject
   */
  getIndex() {
    return this.invertedIndexObject;
  }

  /**
   * Searches and returns docs matching the term query
   * @param {string | string[]} term
   * @returns {[{}]} response
   */
  searchIndex(term) {
    try {
      let res;
      const set = new Set();
      if (typeof term === "string") {
        term = this.doStemming(term).join();
        res = this.verifyTermIsString(term);
        res.forEach(([id, ...rest]) => set.add(this.doc[id]));

        return Array.from(set);
      }
      if (Array.isArray(term)) {
        term = term.map((data) => this.doStemming(data).join());
        res = this.verifyTermIsArray(term);
        for (let word of Object.values(res)) {
          word.forEach(([id, ...rest]) => set.add(this.doc[id]));
        }

        return Array.from(set);
      }

      throw "Search term type invalid: not string or array.";
    } catch (error) {
      return error;
    }
  }

  /**
   * Process Array of terms
   * @param {string[]} termArray Array of terms
   * @returns {{}} res
   */
  verifyTermIsArray(termArray) {
    this.termArrayObject = {};
    return termArray.reduce((acc, word) => {
      word = word.toLowerCase();
      if (!(word in this.invertedIndexObject)) {
        acc[word] = "No match has been made";
      } else {
        acc[word] = this.invertedIndexObject[word];
      }
      return acc;
    }, {});
  }

  /**
   * Process singular term
   * @param {string} term term to search
   * @returns {string[]}
   */
  verifyTermIsString(term) {
    if (term.split(",").length > 1) {
      return this.verifyTermIsPhrase(term);
    }

    term = term.toLowerCase().replace(/\W+/g, "");
    if (!(term in this.invertedIndexObject)) {
      return "No match has been made";
    } else {
      return this.invertedIndexObject[term];
    }
  }

  getArrayIntersection(a1, a2) {
    return a1.filter((n) => {
      console.log(a2, n);
      return true;
    });
  }
  /**
   * Process phrase query
   * @param {string} term phrase to search
   * @returns
   */
  verifyTermIsPhrase(term) {
    return term.split(",").flatMap((w) => this.verifyTermIsString(w));
  }

  //takes term and docReference as arugument and returns the number of times term is present in the reference documnet
  // if no docReference is provided, then it checks for teh complete inverted_index
  //   getFrequency(term, docReference) {
  //     term = this.doStemming(term).join();
  //     if (!(term in this.invertedIndexObject)) {
  //       // edit distance code
  //       return "Term not found";
  //     } else if (docReference === undefined) {
  //       return this.invertedIndexObject[term].length;
  //     } else {
  //       var frequency = 0;
  //       for (var i = 0; i < this.invertedIndexObject[term].length; i++) {
  //         if (this.invertedIndexObject[term][i][0] === docReference) {
  //           frequency++;
  //         }
  //       }
  //       return frequency;
  //     }
  //   }
}

module.exports = InvertedIndex;
