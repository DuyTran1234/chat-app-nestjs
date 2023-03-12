import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type MessageDocument = HydratedDocument<Message>;
@Schema()
export class Message {
    @Prop({
        required: true,
    })
    content: string;

    @Prop({
        required: true,
    })
    sender: string;

    @Prop({
        default: `default-avatar.png`,
    })
    avatar: string;
}
export const MessageSchema = SchemaFactory.createForClass(Message);