import { BadRequestException, UseGuards } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";
import { GqlAuthGuard } from "src/authentication/guard/gql-auth.guard";
import { userAbilityParam } from "src/authorization/guard/ability.metadata";
import { UserAbilityGuard } from "src/authorization/guard/user-ability.guard";
import { Action } from "src/shared/enum/action.enum";
import { MessageModel } from "../model/message.model";
import { MessageService } from "../service/message.service";

@Resolver((of: any) => MessageModel)
export class MessageResolver {
    constructor(
        private messageService: MessageService,
    ) { }

    @userAbilityParam({ action: Action.Update })
    @UseGuards(UserAbilityGuard)
    @UseGuards(GqlAuthGuard)
    @Query(returns => [MessageModel], { nullable: true })
    async getMessagesRoom(@Args("_id") _id: string, @Args("roomName") roomName: string) {
        try {
            const get = await this.messageService.getMessagesRoom(roomName);
            return get;
        } catch (error) {
            throw new BadRequestException(`(RoomResolver) getMessagesRoom error: ${error?.message}`);
        }
    }

    @userAbilityParam({ action: Action.Update })
    @UseGuards(UserAbilityGuard)
    @UseGuards(GqlAuthGuard)
    @Query(returns => MessageModel, { nullable: true })
    async findMessageById(@Args("_id") _id: string, @Args("messageId") msgId: string) {
        try {
            const get = await this.messageService.findMessageById(msgId);
            return get;
        } catch (error) {
            throw new BadRequestException(`(RoomResolver) getMessagesRoom error: ${error?.message}`);
        }
    }
}