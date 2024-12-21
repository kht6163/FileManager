import { Elysia } from "elysia";
import { pgDatabase } from "./pg/main";
import "./pg/auth";

export const pgPool = new Elysia()
    .decorate({ 'pgPool': new pgDatabase() })