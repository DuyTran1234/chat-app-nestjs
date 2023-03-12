import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType({
    description: "User schema graphql"
})
export class UserModel {
    @Field({ nullable: true })
    _id: string;

    @Field({ nullable: true })
    username: string;

    @Field({ nullable: true })
    password: string;

    @Field({ nullable: true })
    email: string;

    @Field({ nullable: true })
    fullname: string;

    @Field({ nullable: true })
    address: string;

    @Field({ nullable: true })
    avatar: string;

    @Field({ nullable: true })
    role: string;

    @Field(type => [String], { nullable: true })
    connectedUsers: Array<string>;

    @Field({ nullable: true })
    verifyEmail: boolean;

    @Field({ nullable: true })
    refreshToken: boolean;

    @Field(type => [String], { nullable: true })
    connectedRooms: Array<string>;
}