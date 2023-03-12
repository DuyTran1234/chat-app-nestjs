import { BadRequestException } from "@nestjs/common";
import { ValidationError } from "class-validator";

export class HandleError {
    static firstMessageError(errors: ValidationError[]): string {
        const firstErrConstraints = errors.at(0).constraints;
        for (let key in firstErrConstraints) {
            return firstErrConstraints[key];
        }
    }
}