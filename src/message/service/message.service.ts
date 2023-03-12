import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Room, RoomDocument } from "src/room/schema/room.schema";
import { Message, MessageDocument } from "../schema/message.schema";

@Injectable()
export class MessageService {
    constructor(
        @InjectModel(Message.name) private messageMongooseModel: Model<MessageDocument>,
        @InjectModel(Room.name) private roomMongooseModel: Model<RoomDocument>,
    ) { }

    async findMessageById(messageId: string): Promise<Message> {
        try {
            const find = await this.messageMongooseModel.findById(messageId);
            return find;
        } catch (error) {
            throw new BadRequestException(`(MessageService) addMessageToRoom error: ${error?.message}`);
        }
    }

    async getMessagesRoom(roomName: string) {
        try {
            const get = await this.roomMongooseModel.findOne({
                roomName,
            });
            if (get) {
                const msg = await this.messageMongooseModel.find(
                    {
                        _id: {
                            $in: get.messages,
                        },
                    }
                ).lean();
                return msg;
            }
            return null;
        } catch (error) {
            throw new BadRequestException(`(MessageService) getMessagesRoom error: ${error?.message}`);
        }
    }
}