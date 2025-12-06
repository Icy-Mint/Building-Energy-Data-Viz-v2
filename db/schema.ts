import { pgTable, serial, text, integer, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const files = pgTable('files', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  fileName: text('file_name').notNull(),
  filePath: text('file_path').notNull(),
  fileSize: integer('file_size').notNull(),
  uploadedAt: timestamp('uploaded_at').defaultNow().notNull(),
});

export const dashboards = pgTable('dashboards', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  fileId: integer('file_id').notNull().references(() => files.id),
  title: text('title').notNull(),
  insights: jsonb('insights'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type File = typeof files.$inferSelect;
export type NewFile = typeof files.$inferInsert;
export type Dashboard = typeof dashboards.$inferSelect;
export type NewDashboard = typeof dashboards.$inferInsert;

