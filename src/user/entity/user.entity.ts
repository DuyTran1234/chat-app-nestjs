import { Exclude, Expose, Transform } from "class-transformer";

@Exclude()
export class UserEntity {
    @Transform((params) => params.obj._id)
    @Expose()
    _id: string;

    @Expose()
    username: string;

    @Expose()
    email: string;

    @Expose()
    fullname: string;

    @Expose()
    address: string;

    @Expose()
    avatar: string;

    @Transform((params) => params.obj.connectedUsers)
    @Expose()
    connectedUsers: Array<string>;

    @Expose()
    verifyEmail: boolean;

    @Transform((params) => params.obj.connectedRooms)
    @Expose()
    connectedRooms: Array<string>;


    @Exclude()
    refreshToken: string

    @Exclude() password: string;

    @Exclude() role: string;
}