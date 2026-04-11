import type {
  CreateJokeInput,
  DeleteJokeInput,
  Joke,
  VoteJokeInput,
} from "#/types";
import { eq, sql } from "drizzle-orm";
import type { DbClient } from "./db/client";
import { commentsTable, jokesTable, votesTable } from "./db/schema";
import { auth } from "#/dal/db/auth"
import { and } from "drizzle-orm"
import { getRequest } from "@tanstack/react-start/server";

export class JokeService {
  constructor(private readonly db: DbClient) { }

  async getJokes(): Promise<Joke[]> {

    const request = getRequest();

    const session = await auth.api.getSession({
      headers: request.headers,
    });

    const userId = session?.user?.id;

    const rows = await this.db.query.jokesTable.findMany({
      with: {
        comments: {
          columns: {
            body: true,
          },
          orderBy: (comment, { asc }) => [asc(comment.createdAt)],
        },
      },
      orderBy: (joke, { asc }) => [asc(joke.createdAt)],
    });

    return await Promise.all(
      rows.map(async (row) => {
        let userVote: 1 | -1 | null = null;

        if (userId) {
          const vote = await this.db.query.votesTable.findFirst({
            where: and(
              eq(votesTable.userId, userId),
              eq(votesTable.jokeId, row.id)
            ),
          });

          userVote = (vote?.value as 1 | -1) ?? null;
        }

        return {
          id: row.id,
          question: row.question,
          answer: row.answer,
          score: row.score,
          userId: row.userId,
          comments: row.comments.map((comment) => comment.body),
          userVote,
        };
      })
    );
  }

  async createJoke(
    input: CreateJokeInput,
    context: any
  ):
    Promise<Joke> {
    const request = getRequest();
    const session = await auth.api.getSession({
      headers: request.headers,
    })
    if (!session?.user) {
      throw new Error('You are not logged in.')
    }
    const userId = session?.user.id

    const [insertedJoke] = await this.db
      .insert(jokesTable)
      .values({
        question: input.question.trim(),
        answer: input.answer.trim(),
        score: 0,
        userId: userId,
      })

      .returning({
        id: jokesTable.id,
        question: jokesTable.question,
        answer: jokesTable.answer,
        userId: jokesTable.userId,
        score: jokesTable.score,
      });

    if (!insertedJoke) {
      throw new Error("Failed to insert joke.");
    }

    return {
      ...insertedJoke,
      comments: [],
      userVote: null,
    };
  }

  async voteJoke(input: VoteJokeInput): Promise<Joke> {
    const request = getRequest();

    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      throw new Error("You must be logged in to vote.");
    }

    const userId = session.user.id;

    const existing = await this.db.query.votesTable.findFirst({
      where: and(
        eq(votesTable.userId, userId),
        eq(votesTable.jokeId, input.id)
      ),
    });

    let delta = input.delta;

    if (!existing) {
      await this.db.insert(votesTable).values({
        userId,
        jokeId: input.id,
        value: input.delta,
      });
    } else if (existing.value === input.delta) {
      await this.db
        .delete(votesTable)
        .where(eq(votesTable.id, existing.id))

      delta = (-input.delta) as 1 | -1;

    } else {
      await this.db
        .update(votesTable)
        .set({ value: input.delta })
        .where(eq(votesTable.id, existing.id));

      delta = input.delta * 2;
    }

    const [updatedJokeRow] = await this.db
      .update(jokesTable)
      .set({
        score: sql<number>`${jokesTable.score} + ${delta}`,
      })
      .where(eq(jokesTable.id, input.id))
      .returning({
        id: jokesTable.id,
        question: jokesTable.question,
        answer: jokesTable.answer,
        userId: jokesTable.userId,
        score: jokesTable.score,
      });

    if (!updatedJokeRow) {
      throw new Error("Joke not found.");
    }

    const comments = await this.db.query.commentsTable.findMany({
      columns: {
        body: true,
      },
      where: eq(commentsTable.jokeId, input.id),
      orderBy: (comment, { asc }) => [asc(comment.createdAt)],
    });

    const updatedJoke = {
      ...updatedJokeRow,
      comments: comments.map((comment) => comment.body),
      userVote:
        existing?.value === input.delta
          ? null
          : input.delta,
    };

    return updatedJoke;
  }

  async deleteJoke(input: DeleteJokeInput): Promise<void> {
    const request = getRequest();

    const session = await auth.api.getSession({
      headers: request.headers,
    });
    if (!session?.user) {
      throw new Error("you cannot delete this joke.")
    }
    const userId = session?.user.id

    const result = await this.db
      .delete(jokesTable)
      .where(
        and(
          eq(jokesTable.id, input.id),
          eq(jokesTable.userId, userId)
        )
      )

    const wasDeleted = Number(result.rowCount ?? 0) > 0;

    if (!wasDeleted) {
      throw new Error("Joke not found.");
    }
  }
}
