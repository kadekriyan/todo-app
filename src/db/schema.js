import {
  mysqlTable,
  int,
  uuid,
  varchar,
  boolean,
  date,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: varchar("id", { length: 36 }).primaryKey(),
  firstname: varchar("firstname", { length: 255 }).notNull(),
  lastname: varchar("lastname", { length: 255 }).notNull(),
  birthdate: date("birthdate").notNull(),
});

export const addresses = mysqlTable(
  "addresses",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    user_id: varchar("user_id", { length: 36 }) // Sesuaikan dengan tipe ID pada tabel users
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    street: varchar("street", { length: 255 }).notNull(),
    city: varchar("city", { length: 255 }).notNull(),
    province: varchar("province", { length: 255 }).notNull(),
    postal_code: varchar("postal_code", { length: 20 }).notNull(),
  },
  (table) => ({
    userIdIndex: ["user_id"], // Definisikan index pada user_id
  })
);

export const todos = mysqlTable(
  "todos",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    user_id: varchar("user_id", { length: 36 }) // Sesuaikan dengan tipe ID pada tabel users
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    title: varchar("title", { length: 255 }).notNull(),
    completed: boolean("completed").default(false),
  },
  (table) => ({
    userIdIndex: ["user_id"], // Definisikan index pada user_id
  })
);
