import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class MessageModel {
    @Field({ nullable: true })
    _id: string;

    @Field({ nullable: true })
    content: string;

    @Field({ nullable: true })
    sender: string;

    @Field({ nullable: true })
    avatar: string;
}