import { DatabaseService } from './services/db.service';
import { logger } from './utils/logger';
import { ThumbnailService } from './services/thumbnail.service';
import { config } from './config';
import {CsvParserService} from "./services/csv.parser.service";
import {RawEntity} from "./types/raw.entity";


export class ImageProcessor {
    async start() {
        const rows = CsvParserService.parse(config.dataFilePath);
        const batchSize = config.batchSize;

        logger.info(`Total items: ${rows.length}, Batch size: ${batchSize}`);

        const rawList: RawEntity[] = rows.map(row => ({
            index: row.index,
            id: row.id,
            url: row.url,
            thumbnail: null,
        }));

        const chunks = this.chunkArray(rawList, Number(batchSize));

        for (const chunk of chunks) {
            try {
                const processedImages = await this.processChunk(chunk);
                await DatabaseService.saveImages(processedImages);
                logger.info(`Processed batch of size: ${processedImages.length}`);
            } catch (error) {
                logger.error(`Error processing batch: ${error}`);
            }
        }
    }

    private async processChunk(chunk: RawEntity[]) {
        const tasks = chunk.map(async entity => {
            entity.thumbnail = await ThumbnailService.createThumbnail(entity.url);
            delete entity.url;
            return entity;
        });

        return (await Promise.allSettled(tasks))
            .filter(result => result.status === 'fulfilled' && result.value.thumbnail)
            .map(result => (result as PromiseFulfilledResult<RawEntity>).value);
    }

    private chunkArray<T>(array: T[], size: number): T[][] {
        return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
            array.slice(i * size, i * size + size),
        );
    }
}