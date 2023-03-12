import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

export class HashGenerator {
    static async hashPassword(pwdInput: string): Promise<string> {
        try {
            const saltOrRounds = 10;
            const hash = await bcrypt.hash(pwdInput, saltOrRounds);
            return hash;
        } catch (error) {
            throw new BadRequestException(error?.message || `(HashGenerator) hashPassword error`);
        }
    }
    static async compare(strInput: string, strHash: string): Promise<boolean> {
        try {
            const isMatch = await bcrypt.compare(strInput, strHash);
            return isMatch;
        } catch (error) {
            throw new BadRequestException(error?.message || `(HashGenerator) compare error`);
        }
    }
}