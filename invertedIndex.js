const e = require("cors");
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
    this.implementSpellCheck();
  }

  /**
   * Optimization Function, Creates Optimized Inverted Index
   * @param {[{title:string, author:string}]} books
   */
  optimize(books) {
    this.invertedIndexObject = {};

    books.forEach((book, idx) => {
      let indexString = `${book.title} ${book.author}`.toLowerCase().trim();

      /** Also possible to save the position of the query string in the document */
      this.doStemming(indexString).reduce((acc, word) => {
        if (word in acc) {
          acc[word].push(idx);
          return acc;
        }

        acc[word] = [idx];
        return acc;
      }, this.invertedIndexObject);
    });
  }

  /**
   * Implememts Spell checker using Tries.
   */
  implementSpellCheck() {
    let corpus = this.books.flatMap((book) => {
      let books = book.title.toLowerCase().split(" ");
      let authors = book.author.toLowerCase().split(" ");
      return [...books, ...authors];
    });
    this.spellcheck = new natural.Spellcheck(corpus);
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
  searchIndex(inputTerm) {
    try {
      let res;
      const set = new Set();
      if (typeof inputTerm === "string") {
        let term = this.doStemming(inputTerm).join();
        res = this.verifyTermIsString(term);
        res.forEach((id) => set.add(this.doc[id]));

        const response = Array.from(set);
        return { found: response.length, response, total: this.doc.length };
      }
      if (Array.isArray(inputTerm)) {
        let term = inputTerm.map((data) => this.doStemming(data).join());
        res = this.verifyTermIsArray(term);
        for (let word of Object.values(res)) {
          word.forEach((id) => set.add(this.doc[id]));
        }

        const response = Array.from(set);
        return { found: response.length, response, total: this.doc.length };
      }

      throw "Search term type invalid: not string or array.";
    } catch (error) {
      console.log("No result found");

      let suggestions = null;
      if (typeof inputTerm === "string") {
        if (inputTerm.split(" ").length > 1) {
          suggestions = inputTerm
            .split(" ")
            .flatMap((s) => this.spellcheck.getCorrections(s, 2));
        } else {
          suggestions = this.spellcheck.getCorrections(inputTerm, 2);
        }
      } else if (Array.isArray(inputTerm)) {
        suggestions = inputTerm.flatMap((s) =>
          this.spellcheck.getCorrections(s, 2)
        );
      }

      return {
        found: 0,
        response: null,
        total: this.doc.length,
        suggestions,
      };
    }
  }

  /**
   * Process Array of terms
   * @param {string[]} termArray Array of terms
   * @returns {{}} result
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
   * @returns {string[]} result
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
    return a1.filter((n) => a2.indexOf(n) !== -1);
  }
  /**
   * Process phrase query
   * @param {string} term phrase to search
   * @returns result
   */
  verifyTermIsPhrase(term) {
    const res = term.split(",").map((w) => this.verifyTermIsString(w));
    let test = res[0];
    for (let i = 1; i < res.length; i++) {
      test = this.getArrayIntersection(test, res[i]);
    }

    return test;
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
