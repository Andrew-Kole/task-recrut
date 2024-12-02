import * as dotenv from 'dotenv';
import Joi from 'joi';

dotenv.config({ path: './.env' });

const envSchema = Joi.object({
    MONGO_URI: Joi.string().required(),
    DEFAULT_BATCH_SIZE: Joi.number().integer().min(1).required(),
    DATA_FILE_PATH: Joi.string().required(),
    LOG_LEVEL: Joi.string().valid('fatal', 'error', 'warn', 'info', 'debug', 'trace').default('info'),
    NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
}).unknown();

const { value: envVars } = envSchema.validate(process.env);

export const config = {
    mongoURI: envVars.MONGO_URI,
    batchSize: envVars.DEFAULT_BATCH_SIZE,
    dataFilePath: envVars.DATA_FILE_PATH,
    logLevel: envVars.LOG_LEVEL,
    nodeEnv: envVars.NODE_ENV,
};




