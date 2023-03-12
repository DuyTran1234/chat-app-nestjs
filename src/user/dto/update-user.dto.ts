import { ArgsType, Field, InputType } from "@nestjs/graphql";
import { IsArray, IsDefined, IsString, Matches } from "class-validator";
import { userRegex } from "src/shared/regex/user.regex";

@InputType()
export class UpdateUserDto {
    @Field({ nullable: true })
    @Matches(userRegex.password)
    password: string;

    @Field({ nullable: true })
    @Matches(userRegex.fullname)
    fullname: string;

    @Field({ nullable: true })
    @Matches(userRegex.address)
    address: string;

    @Field({ nullable: true })
    @IsString()
    avatar: string;
}