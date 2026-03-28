import { integer, json, pgTable, varchar } from "drizzle-orm/pg-core";


export const usersTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    nickname: varchar({ length: 255 }),
    email: varchar({ length: 255 }).notNull().unique(),
    credits: integer().default(0)
});

export const WireframeToCodeTable = pgTable("wireframeToCode", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    uid: varchar().notNull(),
    imageUrl: varchar(),
    model: varchar(),
    description: varchar(),
    code: json(),
    createdBy: varchar()
})

export const customTemplatesTable = pgTable("customTemplates", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    uid: varchar().notNull(),
    name: varchar().notNull(),
    description: varchar(),
    tags: json(),
    templateData: json(),
    commands: varchar(),
    createdBy: varchar()
})