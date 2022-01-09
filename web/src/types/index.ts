export type Book = {
  title: string;
  author: string;
  coverImg: string;
  description: string;
  genres: string;
  price?: number;
  publisher: string;
  rating: number;
};

export type ResponseData = {
  found: number;
  response: Book[] | null;
  total: number;
  suggestions?: string[];
};

export type Suggestion = Pick<Book, "coverImg" | "title">;
