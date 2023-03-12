import { SetMetadata } from "@nestjs/common";
import { Action } from "src/shared/enum/action.enum";
import { Subjects } from "../factory/casl-ability.factory";

export const userAbilityParam = (...userAbilityParam: { action: Action, subject?: Subjects }[]) => {
    return SetMetadata('userAbilityParam', userAbilityParam);
};