import { AbilityBuilder, createMongoAbility, ExtractSubjectType, InferSubjects, MongoAbility } from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { Action } from "src/shared/enum/action.enum";
import { Role } from "src/shared/enum/role.enum";
import { User } from "src/user/schema/user.schema";

export type Subjects = InferSubjects<typeof User>;
export type UserAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
    createForUser(user: User) {
        const { can, build } = new AbilityBuilder<UserAbility>(createMongoAbility);
        if (user.role === Role.Admin) {
            can(Action.Manage, User);
        }
        else if (user.role === Role.User) {
            can(Action.Read, User);
            can(Action.Manage, User, { _id: user._id })
        }
        return build({
            detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects>,
        });
    }
}
