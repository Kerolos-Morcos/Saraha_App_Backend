import dotenv from 'dotenv';

// undefined.env solve
    
dotenv.config({ path: [`.${process.env.NODE_ENV}.env`, '.env'] });

const envConfig = {
    database: {
        DB_URI_LOCAL: process.env.DB_URI_LOCAL ?? "mongodb://localhost/sarahah_app_db",
    },
    server: {
        PORT: process.env.PORT ?? 5011,
    },
    encryption: {
        ENCRYPTION_KEY: process.env.ENCRYPTION_KEY ?? "7f3a9c2e81d64b05f2a7e93c4d8b1a60e5f9472c3a1d8e6b9f0c5a27d4e8136b",
        IV_LENGTH: parseInt(process.env.IV_LENGTH) ?? 16,
    }
};

export default envConfig;