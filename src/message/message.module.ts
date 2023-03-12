import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthenticationModule } from "src/authentication/authentication.module";
import { AuthorizationModule } from "src/authorization/authorization.module";
import { Room, RoomSchema } from "src/room/schema/room.schema";
import { UserModule } from "src/user/user.module";
import { MessageResolver } from "./resolver/message.resolver";
import { Message, MessageSchema } from "./schema/message.schema";
import { MessageService } from "./service/message.service";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Message.name, schema: MessageSchema },
            { name: Room.name, schema: RoomSchema },
        ]),
        AuthenticationModule,
        AuthorizationModule,
        UserModule,
    ],
    providers: [
        MessageService,
        MessageResolver,
    ],
    controllers: [

    ],
})
export class MessageModule { }