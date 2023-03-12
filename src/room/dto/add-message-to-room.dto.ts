import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class AddMessageToRoomDto {
    @Field()
    content: string;

    @Field()
    sender: string;

    @Field()
    roomName: string;

    @Field({ nullable: true })
    avatar: string;
}