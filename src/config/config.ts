const {
    SECRET,
    SECRETRESET,
    dbHost,
    dbUser,
    dbPass,
    dbName,
    dbPort,
    sftpHost,
    sftpPort,
    sftpUser,
    sftpPass,
    emailAuthUser,
    emailAuthPass,
    S3AccessKeyId,
    S3SecretAccessKey,
    stripeKey,
    emailUser,
    emailPass,
    apiHost,
    AWS_SECRET_ACCESS_KEY,
    AWS_ACCESS_KEY_ID,
    S3Endpoint,
    bucketName,
    SECRETKEY,
    LOGIN
} = process.env

export const config = {
    SECRET,
    SECRETRESET,
    emailUser,
    emailPass,
    apiHost,
    bucketName: bucketName,
    AwsAccessKey: AWS_ACCESS_KEY_ID,
    AwsAccessKeySecret: AWS_SECRET_ACCESS_KEY,
    S3Endpoint: S3Endpoint,
    db: {
        host: dbHost,
        user: dbUser,
        password: dbPass,
        database: dbName,
        port: dbPort
    },
    connSettings: {
        host: sftpHost,
        port: Number(sftpPort),
        username: sftpUser,
        password: sftpPass
    },
    emailAuth: {
        user: emailAuthUser,
        pass: emailAuthPass
    },
    s3Auth: {
        accessKeyId: S3AccessKeyId,
        secretAccessKey: S3SecretAccessKey
    },
    stripeKey,
    SECRETKEY,
    LOGIN
}