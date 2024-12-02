import sharp from 'sharp';
import axios from 'axios';
import { logger } from '../utils/logger';

export class ThumbnailService {
    static async createThumbnail(url: string | undefined): Promise<Buffer | null> {
        try {
            if(!url) {
                throw new Error('URL must be a valid URL');
            }
            const response = await axios.get(url, { responseType: 'arraybuffer' });
            return sharp(response.data).resize(100, 100).toBuffer();
        } catch (error) {
            logger.error(`Error creating thumbnail for URL ${url}: ${error}`);
            return null;
        }
    }
}