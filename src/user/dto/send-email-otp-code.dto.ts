import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class SendEmailOtpCodeDto {
    @Field({ nullable: true })
    _id: string;

    @Field({ nullable: true })
    username: string;

    @Field({ nullable: true })
    email: string;
}