import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthenticationModule } from "src/authentication/authentication.module";
import { AuthorizationModule } from "src/authorization/authorization.module";
import { Message, MessageSchema } from "src/message/schema/message.schema";
import { User, UserSchema } from "src/user/schema/user.schema";
import { UserModule } from "src/user/user.module";
import { RoomResolver } from "./resolver/room.resolver";
import { Room, RoomSchema } from "./schema/room.schema";
import { RoomService } from "./service/room.service";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Room.name, schema: RoomSchema },
            { name: User.name, schema: UserSchema },
            { name: Message.name, schema: MessageSchema },
        ]),
        AuthenticationModule,
        AuthorizationModule,
        UserModule,
    ],
    providers: [
        RoomService,
        RoomResolver,
    ],
    controllers: [],
})
export class RoomModule { }