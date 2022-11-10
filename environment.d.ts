declare namespace NodeJS {
    interface ProcessEnv {
        PORT: number;
        NODE_ENV: 'dev' | 'prod' | 'test' | 'staging';
        SECRET: string;

        //Database MySql
        dbHost: string;
        dbUser: string;
        dbPass: string;
        dbName: string;

        //FTP
        sftpHost: string;
        sftpPort: number;
        sftpUser: string;
        sftpPass: string;

        //Email
        emailAuthUser: string;
        emailAuthPass: string;
        emailsForTest: string;

        //S3
        S3AccessKeyId: string;
        S3SecretAccessKey: string;

        //Stripe (deprecated)
        stripeKey: string;

        //Sentry error tracking
        sentryDsn: string;
    }
}

export {}
