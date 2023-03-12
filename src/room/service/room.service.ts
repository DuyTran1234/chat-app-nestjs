import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Message, MessageDocument } from "src/message/schema/message.schema";
import { RoomType } from "src/shared/enum/room-type.enum";
import { User, UserDocument } from "src/user/schema/user.schema";
import { AddMessageToRoomDto } from "../dto/add-message-to-room.dto";
import { CreateRoomDto } from "../dto/create-room.dto";
import { Room, RoomDocument } from "../schema/room.schema";

@Injectable()
export class RoomService {
    constructor(
        @InjectModel(Room.name) private roomMongooseModel: Model<RoomDocument>,
        @InjectModel(User.name) private userMongooseModel: Model<UserDocument>,
        @InjectModel(Message.name) private messageMongooseModel: Model<MessageDocument>,
    ) { }

    async createRoom(createRoomDto: CreateRoomDto): Promise<Room> {
        try {
            if (createRoomDto.type === RoomType.Private) {
                const newMembers = createRoomDto.members.sort();
                createRoomDto.roomName = newMembers.join('.');
                const checkRoomName = await this.findRoomByName(createRoomDto.roomName);
                if (checkRoomName) { return checkRoomName; }
            }
            const createRoom = await this.roomMongooseModel.create(createRoomDto);
            if (createRoom) {
                const updateUsers = await this.userMongooseModel.updateMany({
                    _id: {
                        $in: createRoomDto.members,
                    }
                }, {
                    $addToSet: {
                        connectedRooms: createRoom._id,
                    }
                })
            }
            return createRoom;
        } catch (error) {
            throw new BadRequestException(`(RoomService) createRoom error: ${error?.message}`);
        }
    }
    async findRoomById(roomId: string): Promise<Room> {
        try {
            const findRoom = await this.roomMongooseModel.findById(roomId).lean();
            return findRoom;
        } catch (error) {
            throw new BadRequestException(`(RoomService) findRoomById error: ${error?.message}`);
        }
    }
    async findRoomByName(roomName: string): Promise<Room> {
        try {
            const findRoom = await this.roomMongooseModel.findOne({
                roomName: roomName,
            }).lean();
            return findRoom;
        } catch (error) {
            throw new BadRequestException(`(RoomService) findRoomByName error: ${error?.message}`);
        }
    }
    async addMessageToRoom(addMessageToRoomDto: AddMessageToRoomDto) {
        try {
            const createMsg = await this.messageMongooseModel.create({
                content: addMessageToRoomDto.content,
                sender: addMessageToRoomDto.sender,
                avatar: addMessageToRoomDto.avatar,
            });
            if (createMsg) {
                const addMessageToRoom = await this.roomMongooseModel.findOneAndUpdate({
                    roomName: addMessageToRoomDto.roomName,
                }, {
                    $addToSet: {
                        messages: createMsg._id,
                    }
                }, { new: true }).lean();
                return addMessageToRoom;
            }
            return null;
        } catch (error) {
            throw new BadRequestException(`(RoomService) addMessageToRoom error: ${error?.message}`);
        }
    }
    async getListRooms(roomsId: Array<String>): Promise<Room[]> {
        try {
            const get = await this.roomMongooseModel.find(
                {
                    _id: {
                        $in: roomsId,
                    }
                }
            );
            if (get.length > 0) {
                return get;
            }
            return null;
        } catch (error) {
            throw new BadRequestException(`(RoomService) getListRooms error: ${error?.message}`);
        }
    }
}