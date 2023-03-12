import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { userRegex } from "src/shared/regex/user.regex";

export type UserDocument = HydratedDocument<User>;
@Schema({ timestamps: true, })
export class User {
    _id: string;
    @Prop({
        unique: true,
        required: true,
        validate: userRegex.username,
    })
    username: string;

    @Prop({
        required: true,
    })
    password: string;

    @Prop({
        required: true,
        unique: true,
        validate: userRegex.email,
    })
    email: string;

    @Prop({
        required: true,
        validate: userRegex.fullname,
    })
    fullname: string;

    @Prop({
        validate: userRegex.address,
    })
    address: string;

    @Prop({
        default: `default-avatar.png`
    })
    avatar: string;

    @Prop({
        default: 'user',
        required: true,
        validate: userRegex.role,
    })
    role: string;

    @Prop({
        type: [mongoose.Schema.Types.ObjectId],
    })
    connectedUsers: Array<string>;

    @Prop({
        default: false,
    })
    verifyEmail: boolean;

    @Prop()
    refreshToken: string;

    @Prop({
        type: [mongoose.Schema.Types.ObjectId]
    })
    connectedRooms: Array<string>;

    @Prop()
    otpCode: string;
}
export const UserSchema = SchemaFactory.createForClass(User);