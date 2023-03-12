import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as nanoid from 'nanoid';
import * as path from 'node:path';
import { HashGenerator } from "src/shared/hash-generator";
import { Mail } from "src/shared/mail/mail";
import { writeFileUpload } from "src/shared/writeFileUpload";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { User, UserDocument } from "../schema/user.schema";

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userMongoModel: Model<UserDocument>,
    ) { }

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        try {
            const checkUser = await this.findUserByUsernameOrEmail({
                username: createUserDto.username,
                email: createUserDto.email,
            });
            if (checkUser) { throw new BadRequestException(`(UserService) createUser error: user registed`) };
            const hashPwd = await HashGenerator.hashPassword(createUserDto.password);
            const createUser = await this.userMongoModel.create({
                ...createUserDto,
                password: hashPwd,
            });
            return createUser;
        } catch (error) {
            throw new BadRequestException(`(UserService) createUser error: ${error?.message}`);
        }
    }
    async findUserByUsernameOrEmail({ username, email }: any): Promise<User> {
        try {
            const findUser = await this.userMongoModel.findOne({
                $or: [
                    {
                        username: {
                            $eq: username,
                            $ne: null,
                        }
                    },
                    {
                        email: {
                            $eq: email,
                            $ne: null,
                        }
                    },
                ],
            }).lean();
            return findUser;
        } catch (error) {
            throw new BadRequestException(`(UserService) findUserByUsernameOrEmail error: ${error?.message}`);
        }
    }
    async findUserById(_id: string): Promise<User> {
        try {
            const findUser = await this.userMongoModel.findById(_id).lean();
            if (findUser) { return findUser; }
            return null;
        } catch (error) {
            throw new BadRequestException(`(UserService) findUserById error: ${error?.message}`);
        }
    }
    async updateUser(_id: string, updateUserDto: UpdateUserDto): Promise<User> {
        try {
            let newObj = { ...updateUserDto };
            if (updateUserDto.password) {
                newObj.password = await HashGenerator.hashPassword(updateUserDto.password);
            }
            const updateUser = await this.userMongoModel.findByIdAndUpdate(
                _id, newObj, { new: true, runValidators: true }
            ).lean();
            return updateUser;
        } catch (error) {
            throw new BadRequestException(`(UserService) updateUser error: ${error?.message}`);
        }
    }
    async deleteUser(_id: string): Promise<boolean> {
        try {
            const deleteUser = await this.userMongoModel.deleteOne({
                _id: _id,
            });
            return deleteUser.deletedCount > 0 ? true : false;
        } catch (error) {
            throw new BadRequestException(`(UserService) deleteUser error: ${error?.message}`);
        }
    }
    async forgotPassword({ username, email }: any, otpCodeReceive: string, newPassword: string): Promise<boolean> {
        try {
            const findUser = await this.findUserByUsernameOrEmail({ username, email });
            if (!findUser) { throw new BadRequestException("user id invalid"); }
            if (this.isExpireOtpCode(findUser.otpCode)) {
                throw new BadRequestException("OTP code invalid, please resend request OTP code");
            }
            const checkCode = findUser.otpCode.slice(0, 6).localeCompare(otpCodeReceive);
            if (checkCode === 0) {
                const hashPassword = await HashGenerator.hashPassword(newPassword);
                const updateUser = await this.userMongoModel.findByIdAndUpdate(
                    findUser._id, {
                    $set: {
                        password: hashPassword,
                    }
                }, { new: true, runValidators: true }).lean();
                if (updateUser) {
                    return true;
                }
            }
            return false;
        } catch (error) {
            throw new BadRequestException(`(UserService) forgotPassword error: ${error?.message}`);
        }
    }
    async verifyEmail(_id: string, otpCodeReceive: string): Promise<boolean> {
        try {
            const findUser = await this.userMongoModel.findById(_id);
            if (!findUser) { throw new BadRequestException("user id invalid"); }
            if (this.isExpireOtpCode(findUser.otpCode)) {
                throw new BadRequestException("OTP code invalid, please resend request OTP code");
            }
            const checkCode = findUser.otpCode.slice(0, 6).localeCompare(otpCodeReceive);
            if (checkCode === 0) {
                findUser.verifyEmail = true;
                const saveDoc = await findUser.save();
                if (saveDoc) { return true; }
            }
            return false;
        } catch (error) {
            throw new BadRequestException(`(UserService) verifyEmail error: ${error?.message}`);
        }
    }
    private isExpireOtpCode(otpCode: string) {
        if (!otpCode) { return true; }
        const check = parseInt(otpCode.slice(7));
        return Date.now() > check ? true : false;
    }
    async sendEmailOtpCode({ userId, username, email }: any): Promise<boolean> {
        try {
            const findUser = userId ? await this.findUserById(userId)
                : await this.findUserByUsernameOrEmail({ username, email });
            if (!findUser) {
                throw new BadRequestException(`Email is not registered`);
            }
            if (!this.isExpireOtpCode(findUser.otpCode)) {
                throw new BadRequestException(`OTP code sent, please wait 2 minutes to resend`)
            }
            const customNanoid = nanoid.customAlphabet('1234567890', 10);
            const otpRandomCode = customNanoid(6);
            const expireTime = Date.now() + 120000; // 2 minutes
            const saveCode = `${otpRandomCode}-${expireTime}`;
            const updateOtpCode = await this.userMongoModel.findByIdAndUpdate(findUser._id, {
                $set: {
                    otpCode: saveCode,
                }
            });
            if (updateOtpCode) {
                const sendMail =
                    new Mail().sendEmail(findUser.email, "OTP Code", `OTP Code is valid for 2 minutes: ${otpRandomCode}`);
                return true;
            }
            return false;
        } catch (error) {
            throw new BadRequestException(`(UserService) sendEmailOtpCode erorr: ${error?.message}`);
        }
    }
    async uploadUserAvatar(_id: string, file: Express.Multer.File): Promise<User> {
        try {
            const pathStorage = path.join(process.cwd(), "static", "images", "avatar");
            const writeFilename = `${nanoid.nanoid(5)}-${file.originalname}`;
            const { filename } = writeFileUpload(file, pathStorage, writeFilename);
            const uploadAvatar = await this.userMongoModel.findByIdAndUpdate(_id, {
                $set: {
                    avatar: filename,
                }
            }, { new: true, runValidators: true });
            return uploadAvatar;
        } catch (error) {
            throw new BadRequestException(`(UserService) uploadUserAvatar error: ${error?.message}`);
        }
    }
    async searchUserRegex(searchUser: string): Promise<User[]> {
        try {
            const regex = `${searchUser}`;
            const findUser = await this.userMongoModel.find(
                {
                    $or: [
                        {
                            username: { $regex: regex }
                        },
                        {
                            email: { $regex: regex }
                        }
                    ],
                }
            ).limit(10).lean();
            return findUser;
        } catch (error) {
            throw new BadRequestException(`(UserService) searchUserRegex error: ${error?.message}`);
        }
    }
    async addConnectUsers(_id: string, connectUserId: string): Promise<User> {
        try {
            const updateUser = await this.userMongoModel.findByIdAndUpdate(_id, {
                $addToSet: {
                    connectedUsers: connectUserId,
                }
            }, { new: true, runValidators: true }).lean();
            return updateUser;
        } catch (error) {
            throw new BadRequestException(`(UserService) addConnectUsers error: ${error?.message}`);
        }
    }
    async findConnectUsers(_id: string): Promise<User[]> {
        try {
            const findUser = await this.userMongoModel.findById(_id).lean();
            const connectUsers = await this.userMongoModel.find({
                _id: {
                    $in: [...findUser.connectedUsers],
                }
            }).lean();
            return connectUsers;
        } catch (error) {
            throw new BadRequestException(`(UserService) findConnectUsers error: ${error?.message}`);
        }
    }
    async deleteConnectUser(_id: string, connectUserId: string): Promise<User> {
        try {
            const action = await this.userMongoModel.findByIdAndUpdate(
                _id, {
                $pull: {
                    connectedUsers: connectUserId,
                }
            }, { new: true, runValidators: true }).lean();
            return action;
        } catch (error) {
            throw new BadRequestException(`(UserService) deleteConnectUser error: ${error?.message}`);
        }
    }
}