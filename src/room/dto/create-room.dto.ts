import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateRoomDto {
    @Field({ nullable: true })
    roomName: string;

    @Field(type => [String])
    members: Array<String>;

    @Field()
    type: string;

}