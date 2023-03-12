import { BadRequestException } from '@nestjs/common';
import * as fs from 'node:fs';
import * as path from 'node:path';

export const writeFileUpload = (file: Express.Multer.File, pathStorage: string, filename: string): {
    pathFile: string,
    filename: string,
} => {
    try {
        const mkdir = fs.mkdirSync(pathStorage, { recursive: true });
        const pathFile = path.join(pathStorage, filename);
        const writeFile = fs.writeFileSync(pathFile, file.buffer);
        return {
            pathFile: pathFile,
            filename: filename,
        }
    } catch (error) {
        throw new BadRequestException(`writeFileUpload error`)
    }
}