import dotenv from 'dotenv';

// dotenv.config({ path: [`.${process.env.NODE_ENV}.env`, '.env'] });
dotenv.config({ path: '.env' });

const envConfig = {
    database: {
        DB_URI_LOCAL: process.env.DB_URI_LOCAL ?? "mongodb://localhost/sarahah_app_db",
    },
    server: {
        PORT: process.env.PORT ?? 5011,
        CORS_WHITELIST: process.env.CORS_WHITELIST,
    },
    encryption: {
        ENCRYPTION_KEY: process.env.ENCRYPTION_KEY ?? "7f3a9c2e81d64b05f2a7e93c4d8b1a60e5f9472c3a1d8e6b9f0c5a27d4e8136b",
        IV_LENGTH: parseInt(process.env.IV_LENGTH ?? "16", 10),
    },
    jwt: {
        user: {
            ACCESS_TOKEN_SECRET: process.env.USER_ACCESS_TOKEN_SECRET,
            ACCESS_TOKEN_EXPIRATION_TIME: process.env.USER_ACCESS_TOKEN_EXPIRATION_TIME,
            REFRESH_TOKEN_SECRET: process.env.USER_REFRESH_TOKEN_SECRET,
            REFRESH_TOKEN_EXPIRATION_TIME: process.env.USER_REFRESH_TOKEN_EXPIRATION_TIME,
        },
        admin: {
            ACCESS_TOKEN_SECRET: process.env.ADMIN_ACCESS_TOKEN_SECRET,
            ACCESS_TOKEN_EXPIRATION_TIME: process.env.ADMIN_ACCESS_TOKEN_EXPIRATION_TIME,
            REFRESH_TOKEN_SECRET: process.env.ADMIN_REFRESH_TOKEN_SECRET,
            REFRESH_TOKEN_EXPIRATION_TIME: process.env.ADMIN_REFRESH_TOKEN_EXPIRATION_TIME,
        }
    },
    google: {
        GCP_CLIENT_ID: process.env.GCP_CLIENT_ID,
    },
    redis: {
        URI: process.env.REDIS_CLOUD_URI,
    }

};

export default envConfig;