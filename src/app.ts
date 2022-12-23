import express, { Request, Response } from 'express';
import * as cors from 'cors';
import * as morgan from 'morgan';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import 'dotenv/config';
import path from 'path';
import * as cron from 'node-cron'
import * as status from '../src/events/paymetnStatus'

const { sentryDsn, PORT, NODE_ENV } = process.env
const isDevelopment = ['dev', 'development'].includes(NODE_ENV)
const isProduction = ['prod', 'production'].includes(NODE_ENV)


const app: express.Application = express();

if (isProduction) {
    Sentry.init({
        dsn: sentryDsn,
        integrations: [
            new Sentry.Integrations.Http({ tracing: true }),
            new Tracing.Integrations.Express({ app }),
        ],
  
        // Set tracesSampleRate to 1.0 to capture 100%
        // of transactions for performance monitoring.
        // We recommend adjusting this value in production
        tracesSampleRate: 1.0,
    });
}

const options: cors.CorsOptions = {
    allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'X-Access-Token',
        'Access-Control-Allow-Origin'
    ],
    credentials: true,
    methods: 'GET,OPTIONS,PUT,POST',
    origin: '*',
    preflightContinue: false,
};

app.set('port', PORT || 3000)

// Midlewares

// app.use(express.json())
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

app.set('view engine', 'ejs');
app.use(cors.default(options));
app.disable('etag');
app.use(express.static(path.join(__dirname , 'public')))
import moment from 'moment';


if(isDevelopment)
    app.use(morgan.default('dev'))

if (isProduction) {
    app.use(Sentry.Handlers.requestHandler());
    app.use(Sentry.Handlers.tracingHandler());
}

import router from './router'
import { verifyStatus } from './events/paymetnStatus';


app.use('/api', router)
app.all('*', (req: Request, res: Response) => res.sendStatus(404))

// setInterval(()=>{
//     verifyStatus()
// },60000)
// cron.schedule("* */24 * * *", ()=>{
//     verifyStatus()
// })


if (isProduction) {
    app.use(Sentry.Handlers.errorHandler());
}

export default app