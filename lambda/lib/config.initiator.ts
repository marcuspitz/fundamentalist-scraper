import { DatabaseSQ } from "../../server/repositories/base.repository";
import env from 'dotenv';

export function lambdaWithoutDbSetUp() {
    env.config();
}

export function lambdaSetUp() {
    env.config();
    DatabaseSQ.getSequelize();
}