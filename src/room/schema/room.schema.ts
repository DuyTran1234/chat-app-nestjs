import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Message } from "src/message/schema/message.schema";

export type RoomDocument = HydratedDocument<Room>;

@Schema({ timestamps: true })
export class Room {
    @Prop({
        required: true,
        unique: true,
    })
    roomName: string;

    @Prop({
        type: [mongoose.Schema.Types.ObjectId],
    })
    messages: Array<String>;

    @Prop({
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
        }]
    })
    members: Array<Message>;

    @Prop({
        required: true,
    })
    type: string;
}
export const RoomSchema = SchemaFactory.createForClass(Room);