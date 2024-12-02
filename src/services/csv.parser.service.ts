import * as fs from 'node:fs';
import { logger } from '../utils/logger';
import {ParsedRow} from "../types/parsed.raw";
import path from "node:path";


export class CsvParserService {
    static parse(filePath: string): ParsedRow[] {
        try {
            const resolvedPath = path.resolve(filePath);
            console.log(resolvedPath);
            const data = fs.readFileSync(filePath, 'utf8');
            const rows = data.split('\n');
            const headers = rows.shift()?.split(',') || [];
            return rows.map((row: string) => {
                const values = row.split(',');
                return headers.reduce((obj: { [key: string]: string; }, header: string, index: number) => {
                    obj[header.trim()] = values[index]?.trim();
                    return obj;
                }, {}) as unknown as ParsedRow;
            });
        } catch (error) {
            logger.error(`Error parsing CSV file: ${error}`);
            throw error;
        }
    }
}