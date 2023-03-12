import { forwardRef, Module } from "@nestjs/common";
import { UserModule } from "src/user/user.module";
import { CaslAbilityFactory } from "./factory/casl-ability.factory";


@Module({
    imports: [
        forwardRef(() => UserModule),
    ],
    providers: [
        CaslAbilityFactory,
    ],
    exports: [
        CaslAbilityFactory,
    ],
})
export class AuthorizationModule { }