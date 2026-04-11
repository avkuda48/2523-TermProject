import type { CommentRow, JokeRow } from "src/dal/db/schema.ts";

export type Joke = Pick<
  JokeRow,
  "id" | "question" | "answer" | "score" | "userId"
> & {
  comments: CommentRow["body"][];
  userVote: 1 | -1 | null;
};

export interface CreateJokeInput {
  question: Joke["question"];
  answer: Joke["answer"];
}

export interface VoteJokeInput {
  id: Joke["id"];
  delta: 1 | -1;
}

export interface DeleteJokeInput {
  id: Joke["id"];
}

export interface User {
  user_id: Number,
  user_name: String,
  email: String,
  password: String,
}
