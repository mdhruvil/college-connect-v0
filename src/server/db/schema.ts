import { relations, sql } from "drizzle-orm";
import {
  index,
  int,
  primaryKey,
  sqliteTableCreator,
  text,
} from "drizzle-orm/sqlite-core";
import { type AdapterAccount } from "next-auth/adapters";
import { ClubPosition } from "~/lib/constants";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = sqliteTableCreator(
  (name) => `college-connect_${name}`,
);

export const posts = createTable(
  "post",
  {
    id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    name: text("name", { length: 256 }),
    createdById: text("created_by", { length: 255 })
      .notNull()
      .references(() => users.id),
    createdAt: int("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: int("updatedAt", { mode: "timestamp" }).$onUpdate(
      () => new Date(),
    ),
  },
  (example) => ({
    createdByIdIdx: index("created_by_idx").on(example.createdById),
    nameIndex: index("name_idx").on(example.name),
  }),
);

export const users = createTable(
  "user",
  {
    id: text("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name", { length: 255 }),
    email: text("email", { length: 255 }).notNull(),
    emailVerified: int("email_verified", {
      mode: "timestamp",
    }).default(sql`(unixepoch())`),
    image: text("image", { length: 255 }),
    enrollmentNo: int("enrollment_no", { mode: "number" }).notNull().default(0),
    degree: text("degree").notNull().default("Not Added"),
    yearOfStudy: int("year_of_study", { mode: "number" }).notNull().default(1),
    department: text("department").notNull().default("Not Added"),
  },
  (self) => ({
    userEnrollmentNoIdx: index("user_enrollment_no_idx").on(self.enrollmentNo),
  }),
);

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  clubToMembers: many(clubToMembers),
  eventRegistrations: many(eventRegistrations),
}));

export const clubs = createTable("clubs", {
  id: text("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  createdById: text("created_by", { length: 255 })
    .notNull()
    .references(() => users.id),
  createdAt: int("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  image: text("image", { length: 255 }),
});

export const clubsRelations = relations(clubs, ({ one, many }) => ({
  creator: one(users, { fields: [clubs.createdById], references: [users.id] }),
  clubToMembers: many(clubToMembers),
}));

export const clubToMembers = createTable(
  "club_to_members",
  {
    clubId: text("club_id", { length: 255 })
      .notNull()
      .references(() => clubs.id),
    memberId: text("member_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    postition: text("postition", {
      length: 255,
      enum: [ClubPosition.MEMBER, ClubPosition.CREATOR, ClubPosition.HEAD],
    }),
  },
  (self) => ({
    pk: primaryKey({ columns: [self.clubId, self.memberId] }),
  }),
);

export const clubToMembersRelations = relations(clubToMembers, ({ one }) => ({
  club: one(clubs, { fields: [clubToMembers.clubId], references: [clubs.id] }),
  member: one(users, {
    fields: [clubToMembers.memberId],
    references: [users.id],
  }),
}));

export const events = createTable("events", {
  id: text("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  createdById: text("created_by", { length: 255 })
    .notNull()
    .references(() => users.id),
  createdAt: int("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  clubId: text("club_id", { length: 255 })
    .notNull()
    .references(() => clubs.id),
  image: text("image", { length: 255 }),
  eventDate: int("event_date", { mode: "timestamp" }).notNull(),
  location: text("location", { length: 255 }),
  type: text("type", { length: 255, enum: ["ONLINE", "OFFLINE"] }),
});

export const eventsRelations = relations(events, ({ one, many }) => ({
  creator: one(users, { fields: [events.createdById], references: [users.id] }),
  club: one(clubs, { fields: [events.clubId], references: [clubs.id] }),
  eventRegistrations: many(eventRegistrations),
}));

export const eventRegistrations = createTable(
  "event_registrations",
  {
    eventId: text("event_id", { length: 255 })
      .notNull()
      .references(() => events.id),
    memberId: text("member_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    status: text("status", { length: 255 }),
    registeredAt: int("registered_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
  },
  (self) => ({
    pk: primaryKey({ columns: [self.eventId, self.memberId] }),
  }),
);

export const eventRegistrationsRelations = relations(
  eventRegistrations,
  ({ one }) => ({
    event: one(events, {
      fields: [eventRegistrations.eventId],
      references: [events.id],
    }),
    member: one(users, {
      fields: [eventRegistrations.memberId],
      references: [users.id],
    }),
  }),
);

export const accounts = createTable(
  "account",
  {
    userId: text("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: text("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: text("provider", { length: 255 }).notNull(),
    providerAccountId: text("provider_account_id", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: int("expires_at"),
    token_type: text("token_type", { length: 255 }),
    scope: text("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: text("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_user_id_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: text("session_token", { length: 255 }).notNull().primaryKey(),
    userId: text("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: int("expires", { mode: "timestamp" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_userId_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  {
    identifier: text("identifier", { length: 255 }).notNull(),
    token: text("token", { length: 255 }).notNull(),
    expires: int("expires", { mode: "timestamp" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);
