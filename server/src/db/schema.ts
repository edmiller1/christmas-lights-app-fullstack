import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

//ENUMS
export const planEnum = pgEnum("plan", ["FREE", "PRO"]);
export const statusEnum = pgEnum("status", ["pending", "approved", "rejected"]);
export const verificationEnum = pgEnum("verificationStatus", [
  "approved",
  "pending",
  "rejected",
]);

//TABLES
export const User = pgTable(
  "user",
  {
    id: uuid().notNull().primaryKey().defaultRandom(),
    externalId: text("externalId").notNull(),
    name: varchar("name", { length: 255 }),
    email: varchar("email", { length: 255 }).notNull(),
    emailVerified: boolean("emailVerified").default(false),
    provider: varchar("provider", { length: 255 }),
    image: varchar("image", { length: 255 }),
    plan: planEnum("plan").default("FREE"),
    admin: boolean("admin").default(false),
    notificationsOnAppVerification: boolean(
      "notificationsOnAppVerification"
    ).default(true),
    notificationsOnAppRating: boolean("notificationsOnAppRating").default(true),
    notificationsByEmailVerification: boolean(
      "notificationsByEmailVerification"
    ).default(true),
    notificationsByEmailRating: boolean("notificationsByEmailRating").default(
      true
    ),
    maxDecorations: integer().default(5),
    maxImagesPerDecoration: integer().default(5),
    maxFavorites: integer().default(10),
    maxHistory: integer().default(20),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", {
      mode: "date",
      withTimezone: true,
    }).$onUpdateFn(() => sql`now()`),
  },
  (table) => ({
    emailIdx: uniqueIndex("email_idx").on(table.email),
  })
);

export const Subscription = pgTable("subscription", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  userId: t
    .uuid()
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  lemonSqueezyId: t.varchar({ length: 255 }).notNull(),
  orderId: t.varchar({ length: 255 }),
  status: t.varchar({ length: 255 }).notNull(), // active, cancelled, expired
  variantId: t.varchar({ length: 255 }),
  renewsAt: t.timestamp(),
  endsAt: t.timestamp(),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdateFn(() => sql`now()`),
}));

export const Decoration = pgTable("decoration", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  name: t.varchar({ length: 255 }).notNull(),
  address: t.varchar({ length: 255 }).notNull(),
  verified: t.boolean().default(false),
  verificationSubmitted: t.boolean().default(false),
  verificationStatus: verificationEnum("verificationStatus"),
  latitude: t.doublePrecision().notNull(),
  longitude: t.doublePrecision().notNull(),
  country: t.varchar({ length: 255 }).notNull(),
  region: t.varchar({ length: 255 }).notNull(),
  city: t.varchar({ length: 255 }).notNull(),
  year: t.varchar({ length: 255 }).notNull(),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdateFn(() => sql`now()`),
  userId: t
    .uuid()
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  routeId: t.uuid().references(() => Route.id, { onDelete: "cascade" }),
}));

export const DecorationImage = pgTable("decoration_image", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  publicId: text("public_id").notNull(),
  url: text("url").notNull(),
  index: t.integer().notNull(),
  decorationId: t
    .uuid()
    .notNull()
    .references(() => Decoration.id, { onDelete: "cascade" }),
}));

export const Rating = pgTable("rating", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  rating: t.integer().notNull(),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdateFn(() => sql`now()`),
  decorationId: t
    .uuid()
    .notNull()
    .references(() => Decoration.id),
  userId: t
    .uuid()
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
}));

export const View = pgTable("view", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  createdAt: t.timestamp().defaultNow().notNull(),
  decorationId: t
    .uuid()
    .notNull()
    .references(() => Decoration.id, { onDelete: "cascade" }),
}));

export const Notification = pgTable("notification", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  title: t.varchar({ length: 255 }).notNull(),
  content: t.text().notNull(),
  unread: t.boolean().default(true),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdateFn(() => sql`now()`),
  userId: t
    .uuid()
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
}));

export const Report = pgTable("report", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  reasons: t.text().notNull().array(),
  additionalInfo: t.text(),
  unresolved: t.boolean().default(false),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdateFn(() => sql`now()`),
  decorationId: t
    .uuid()
    .notNull()
    .references(() => Decoration.id, { onDelete: "cascade" }),
  userId: t
    .uuid()
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
}));

export const Verification = pgTable("verification", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  publicId: t.text().notNull(),
  document: t.text().notNull(),
  status: statusEnum("status").default("pending").notNull(),
  rejectedReason: t.text(),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdateFn(() => sql`now()`),
  decorationId: t
    .uuid()
    .notNull()
    .references(() => Decoration.id, { onDelete: "cascade" }),
  userId: t
    .uuid()
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
}));

export const Route = pgTable("route", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  name: t.varchar({ length: 255 }).notNull(),
  description: t.text(),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdateFn(() => sql`now()`),
}));

export const Favourite = pgTable("favourite", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  createdAt: t.timestamp().defaultNow().notNull(),
  decorationId: t
    .uuid()
    .notNull()
    .references(() => Decoration.id, { onDelete: "cascade" }),
  userId: t
    .uuid()
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdateFn(() => sql`now()`),
}));

export const History = pgTable("history", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  createdAt: t.timestamp().defaultNow().notNull(),
  decorationId: t
    .uuid()
    .notNull()
    .references(() => Decoration.id, { onDelete: "cascade" }),
  userId: t
    .uuid()
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdateFn(() => sql`now()`),
}));

//RELATIONS
export const UserRelations = relations(User, ({ many, one }) => ({
  decorations: many(Decoration),
  ratings: many(Rating),
  favourites: many(Favourite),
  history: many(History),
  reports: many(Report),
  routes: many(Route),
  verifications: many(Verification),
  subscription: one(Subscription, {
    fields: [User.id],
    references: [Subscription.userId],
  }),
}));

export const SubscriptionRelations = relations(Subscription, ({ one }) => ({
  user: one(User, {
    fields: [Subscription.userId],
    references: [User.id],
  }),
}));

export const DecorationRelations = relations(Decoration, ({ many, one }) => ({
  images: many(DecorationImage),
  owner: one(User, { fields: [Decoration.userId], references: [User.id] }),
  ratings: many(Rating),
  views: many(View),
  reports: many(Report),
  verification: one(Verification, {
    fields: [Decoration.id],
    references: [Verification.decorationId],
  }),
  route: one(Route, {
    fields: [Decoration.routeId],
    references: [Route.id],
  }),
}));

export const DecorationImageRelations = relations(
  DecorationImage,
  ({ many, one }) => ({
    decoration: one(Decoration, {
      fields: [DecorationImage.decorationId],
      references: [Decoration.id],
    }),
  })
);

export const RatingRelations = relations(Rating, ({ many, one }) => ({
  decoration: one(Decoration, {
    fields: [Rating.decorationId],
    references: [Decoration.id],
  }),
  user: one(User, {
    fields: [Rating.userId],
    references: [User.id],
  }),
}));

export const ViewRelations = relations(View, ({ one }) => ({
  decoration: one(Decoration, {
    fields: [View.decorationId],
    references: [Decoration.id],
  }),
}));

export const FavouriteRelations = relations(Favourite, ({ one }) => ({
  user: one(User, {
    fields: [Favourite.userId],
    references: [User.id],
  }),
  decoration: one(Decoration, {
    fields: [Favourite.decorationId],
    references: [Decoration.id],
  }),
}));

export const ReportRelations = relations(Report, ({ one }) => ({
  decoration: one(Decoration, {
    fields: [Report.decorationId],
    references: [Decoration.id],
  }),
  user: one(User, {
    fields: [Report.userId],
    references: [User.id],
  }),
}));

export const VerificationRelations = relations(Verification, ({ one }) => ({
  decoration: one(Decoration, {
    fields: [Verification.decorationId],
    references: [Decoration.id],
  }),
  user: one(User, {
    fields: [Verification.userId],
    references: [User.id],
  }),
}));

export const HistoryRelations = relations(History, ({ one }) => ({
  user: one(User, {
    fields: [History.userId],
    references: [User.id],
  }),
  decoration: one(Decoration, {
    fields: [History.decorationId],
    references: [Decoration.id],
  }),
}));
