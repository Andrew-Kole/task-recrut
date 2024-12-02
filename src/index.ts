import * as mongoose from 'mongoose';
import { config } from './config';
import { logger } from './utils/logger';
import { ImageProcessor } from './image.processor';

(async () => {
    try {
        await mongoose.connect(config.mongoURI, {
            autoIndex: false, // Disable auto-indexing in production
            maxPoolSize: 10,  // Limit the connection pool size
        });

        logger.info('Database connected successfully.');

        const processor = new ImageProcessor();
        await processor.start();
    } catch (error) {
        logger.error(`Error: ${error}`);
    } finally {
        try {
            await mongoose.disconnect();
            logger.info('Database disconnected.');
        } catch (disconnectError) {
            logger.error(`Error during database disconnection: ${disconnectError}`);
        }
    }
})();