"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
var node_postgres_1 = require("drizzle-orm/node-postgres");
var pg_1 = require("pg");
var env_1 = require("../env");
var schema = require("./schema");
var Pool = pg_1.default.Pool;
var connection;
if (env_1.env.NEXT_PUBLIC_APP_ENV === "production" ||
    env_1.env.NEXT_PUBLIC_APP_ENV === "staging") {
    connection = new Pool({
        connectionString: env_1.env.DATABASE_URL + "?sslmode=require",
        max: 1,
    });
}
else {
    var globalConnection = global;
    globalConnection.connection = new Pool({
        connectionString: env_1.env.DATABASE_URL + "?sslmode=require",
        max: 20,
    });
    connection = globalConnection.connection;
}
var db = (0, node_postgres_1.drizzle)(connection, {
    schema: schema,
    logger: env_1.env.NEXT_PUBLIC_APP_ENV === "development" && env_1.env.LOG_SQL_QUERIES === true,
});
exports.db = db;
__exportStar(require("./schema"), exports);
