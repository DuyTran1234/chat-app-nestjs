import { BadRequestException, UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GqlAuthGuard } from "src/authentication/guard/gql-auth.guard";
import { userAbilityParam } from "src/authorization/guard/ability.metadata";
import { UserAbilityGuard } from "src/authorization/guard/user-ability.guard";
import { Action } from "src/shared/enum/action.enum";
import { AddMessageToRoomDto } from "../dto/add-message-to-room.dto";
import { CreateRoomDto } from "../dto/create-room.dto";
import { RoomModel } from "../model/room.model";
import { RoomService } from "../service/room.service";

@Resolver((of: any) => RoomModel)
export class RoomResolver {
    constructor(
        private roomService: RoomService,
    ) { }

    @UseGuards(GqlAuthGuard)
    @Query(returns => RoomModel, { nullable: true })
    async findRoomById(@Args("_id") _id: string) {
        try {
            const rs = await this.roomService.findRoomById(_id);
            return rs;
        } catch (error) {
            throw new BadRequestException(`(RoomResolver) findRoomById error: ${error?.message}`);
        }
    }

    @UseGuards(GqlAuthGuard)
    @Query(returns => RoomModel, { nullable: true })
    async findRoomByName(@Args("roomName") roomName: string) {
        try {
            const rs = await this.roomService.findRoomByName(roomName);
            return rs;
        } catch (error) {
            throw new BadRequestException(`(RoomResolver) findRoomByName error: ${error?.message}`);
        }
    }

    @userAbilityParam({ action: Action.Update })
    @UseGuards(UserAbilityGuard)
    @UseGuards(GqlAuthGuard)
    @Mutation(returns => RoomModel, { nullable: true })
    async createRoom(@Args("_id") _id: string, @Args("createRoomDto") createRoomDto: CreateRoomDto) {
        try {
            const create = await this.roomService.createRoom(createRoomDto);
            return create;
        } catch (error) {
            throw new BadRequestException(`(RoomResolver) createRoom error: ${error?.message}`);
        }
    }

    @userAbilityParam({ action: Action.Update })
    @UseGuards(UserAbilityGuard)
    @UseGuards(GqlAuthGuard)
    @Mutation(returns => RoomModel, { nullable: true })
    async addMessageToRoom(@Args("_id") _id: string,
        @Args("addMessageToRoomDto") addMessageToRoomDto: AddMessageToRoomDto) {
        try {
            const add = await this.roomService.addMessageToRoom(addMessageToRoomDto);
            return add;
        } catch (error) {
            throw new BadRequestException(`(RoomResolver) addMessageToRoom error: ${error?.message}`);
        }
    }

    @userAbilityParam({ action: Action.Update })
    @UseGuards(UserAbilityGuard)
    @UseGuards(GqlAuthGuard)
    @Query(returns => [RoomModel], { nullable: true })
    async getListRooms(@Args("_id") _id: string,
        @Args("listRoomId", { type: () => [String] }) listRoomId: Array<String>) {
        try {
            const list = await this.roomService.getListRooms(listRoomId);
            return list;
        } catch (error) {
            throw new BadRequestException(`(RoomResolver) addMessageToRoom error: ${error?.message}`);
        }
    }
}

