import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthenticationModule } from "src/authentication/authentication.module";
import { AuthorizationModule } from "src/authorization/authorization.module";
import { UserController } from "./controller/user.controller";
import { UserResolver } from "./resolver/user.resolver";
import { User, UserSchema } from "./schema/user.schema";
import { UserService } from "./service/user.service";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
        ]),
        forwardRef(() => AuthenticationModule),
        forwardRef(() => AuthorizationModule),
    ],
    controllers: [
        UserController,
    ],
    providers: [
        UserResolver,
        UserService,
    ],
    exports: [
        UserService,
    ],
})
export class UserModule { }