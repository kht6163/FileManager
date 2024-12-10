import { Elysia } from "elysia";
import { swagger } from '@elysiajs/swagger'
import { opentelemetry } from '@elysiajs/opentelemetry'
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto'

import {login} from "./routers/auth";

const app = new Elysia()
    // .use(
    //     opentelemetry({
    //         spanProcessors: [
    //             new BatchSpanProcessor(
    //                 new OTLPTraceExporter()
    //             )
    //         ]
    //     })
    // )
    .use(swagger())
    .use(login)
    .listen(Number(process.env.PORT));

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
