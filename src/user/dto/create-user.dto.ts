import { Field, InputType } from "@nestjs/graphql";
import { IsDefined, Matches } from "class-validator";
import { userRegex } from "src/shared/regex/user.regex";

@InputType()
export class CreateUserDto {
    @Field()
    @IsDefined()
    @Matches(userRegex.username)
    username: string;

    @Field()
    @IsDefined()
    @Matches(userRegex.password)
    password: string;

    @Field()
    @IsDefined()
    @Matches(userRegex.email)
    email: string;

    @Field()
    @IsDefined()
    @Matches(userRegex.fullname)
    fullname: string;
}