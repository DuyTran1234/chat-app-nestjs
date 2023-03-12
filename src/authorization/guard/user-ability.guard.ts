import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlContextType, GqlExecutionContext } from "@nestjs/graphql";
import { plainToInstance } from "class-transformer";
import { Action } from "src/shared/enum/action.enum";
import { User } from "src/user/schema/user.schema";
import { UserService } from "src/user/service/user.service";
import { CaslAbilityFactory, Subjects } from "../factory/casl-ability.factory";


@Injectable()
export class UserAbilityGuard implements CanActivate {

    constructor(
        private userService: UserService,
        private reflector: Reflector,
        private caslAbilityFactory: CaslAbilityFactory,
    ) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        if (context.getType<GqlContextType>() === 'graphql') {
            const ctx = GqlExecutionContext.create(context);
            const userAuth = ctx.getContext().req.user;
            const findUserAuth = await this.userService.findUserById(userAuth._id);
            if (!findUserAuth) {
                throw new UnauthorizedException('Restricted user');
            }
            const userAbilityParam =
                this.reflector.get<{ action: Action, subject?: Subjects }[]>('userAbilityParam', context.getHandler());

            const { action, subject } = userAbilityParam[0];
            const userAbility = this.caslAbilityFactory.createForUser(findUserAuth);
            if (!subject) {
                const { _id } = ctx.getArgs();
                return userAbility.can(action, plainToInstance(User, { _id }));
            }
            return userAbility.can(action, User);
        }
        else if (context.getType() === 'http') {
            const request = context.getArgByIndex(0);
            const userAuth = request?.user;
            const findUserAuth = await this.userService.findUserById(userAuth._id);
            if (!findUserAuth) {
                throw new UnauthorizedException('Restricted user');
            }
            const userAbilityParam =
                this.reflector.get<{ action: Action, subject?: Subjects }[]>('userAbilityParam', context.getHandler());

            const { action, subject } = userAbilityParam[0];
            const userAbility = this.caslAbilityFactory.createForUser(findUserAuth);
            if (!subject) {
                const { _id } = request?.params;
                return userAbility.can(action, plainToInstance(User, { _id }));
            }
            return userAbility.can(action, User);
        }
        return false;
    }

}