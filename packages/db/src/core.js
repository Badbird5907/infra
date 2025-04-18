"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.coreUsers = void 0;
var pg_core_1 = require("drizzle-orm/pg-core");
var table = (0, pg_core_1.pgTableCreator)(function (name) { return "core_".concat(name); });
exports.coreUsers = table("users", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    username: (0, pg_core_1.text)("username").notNull().unique(),
    email: (0, pg_core_1.text)("email").notNull().unique(),
    metadata: (0, pg_core_1.jsonb)("metadata").$type().notNull().default({}),
    createdAt: (0, pg_core_1.timestamp)("created_at").notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").notNull().defaultNow(),
});
