import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { HandleError } from "src/shared/handle-error/handle-error";

@Injectable()
export class UpdateUserValidator implements PipeTransform {
    async transform(value: any, { metatype }: ArgumentMetadata) {
        try {
            const obj = plainToInstance(metatype, value);
            const errors = await validate(obj, {
                skipMissingProperties: true,
                whitelist: true,
                forbidNonWhitelisted: true,
            });
            if (errors.length > 0) {
                throw new BadRequestException(`${HandleError.firstMessageError(errors)}`);
            }
            return value;
        } catch (error) {
            throw new BadRequestException(`(UpdateUserValidator) error: ${error?.message}`);
        }
    }

}