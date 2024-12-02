import { ImageModel } from '../models/Image';
import { logger } from '../utils/logger';

export class DatabaseService {
    static async saveImages(images: Array<Record<string, any>>) {
        try {
            await ImageModel.insertMany(images, { ordered: false });
        } catch (error) {
            logger.error(`Error saving images to database: ${error}`);
            throw error;
        }
    }
}