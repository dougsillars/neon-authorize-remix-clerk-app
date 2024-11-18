import { InferSelectModel, sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  pgPolicy,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const loginHistory = pgTable(
  "login_history",
  {
    id: bigint("id", { mode: "bigint" })
      .primaryKey()
      .generatedByDefaultAsIdentity(),
    userId: text("user_id")
      .notNull()
      .default(sql`(auth.user_id())`),
    insertedAt: timestamp("inserted_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => ({
    p1: pgPolicy("create login_history", {
      for: "insert",
      to: "authenticated",
      withCheck: sql`(select auth.user_id() = user_id)`,
    }),

    p2: pgPolicy("view login_history", {
      for: "select",
      to: "authenticated",
      using: sql`(select auth.user_id() = user_id)`,
    }),

    p3: pgPolicy("update login_history", {
      for: "update",
      to: "authenticated",
      using: sql`(select auth.user_id() = user_id)`,
    }),

    p4: pgPolicy("delete login_history", {
      for: "delete",
      to: "authenticated",
      using: sql`(select auth.user_id() = user_id)`,
    }),
  }),
);

export type LoginHistory = InferSelectModel<typeof tscodos>;
