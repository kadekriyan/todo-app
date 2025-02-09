import { mysqlTable, int, varchar, boolean } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(), // Gunakan INT dengan AUTO_INCREMENT
  firstname: varchar("firstname", { length: 255 }).notNull(),
  lastname: varchar("lastname", { length: 255 }).notNull(),
  birthdate: varchar("birthdate", { length: 255 }).notNull(),
});

export const addresses = mysqlTable("addresses", {
  id: int("id").primaryKey().autoincrement(), // Gunakan INT dengan AUTO_INCREMENT
  user_id: int("user_id") // Sesuaikan dengan tipe ID pada tabel users
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
  street: varchar("street", { length: 255 }).notNull(),
  city: varchar("city", { length: 255 }).notNull(),
  province: varchar("province", { length: 255 }).notNull(),
  postal_code: varchar("postal_code", { length: 20 }).notNull(),
});

export const todos = mysqlTable("todos", {
  id: int("id").primaryKey(),
  user_id: int("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  completed: boolean("completed").default(false),
});
