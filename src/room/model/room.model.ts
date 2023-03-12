import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class RoomModel {
    @Field({ nullable: true })
    _id: string;

    @Field({ nullable: true })
    roomName: string;

    @Field(type => [String], { nullable: true })
    messages: Array<string>;

    @Field(type => [String], { nullable: true })
    members: Array<string>;

    @Field({ nullable: true })
    type: string;
}