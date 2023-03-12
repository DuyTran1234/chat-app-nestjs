import { BadRequestException, UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { plainToInstance } from "class-transformer";
import { GqlAuthGuard } from "src/authentication/guard/gql-auth.guard";
import { CurrentUser } from "src/authentication/service/current-user";
import { userAbilityParam } from "src/authorization/guard/ability.metadata";
import { UserAbilityGuard } from "src/authorization/guard/user-ability.guard";
import { Action } from "src/shared/enum/action.enum";
import { CreateUserDto } from "../dto/create-user.dto";
import { SendEmailOtpCodeDto } from "../dto/send-email-otp-code.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { UserEntity } from "../entity/user.entity";
import { UserModel } from "../model/user.model";
import { User } from "../schema/user.schema";
import { UserService } from "../service/user.service";
import { CreateUserValidator } from "../validator/create-user.validator";
import { UpdateUserValidator } from "../validator/update-user.validator";

@Resolver((of: any) => UserModel)
export class UserResolver {
    constructor(
        private userService: UserService,
    ) { }

    @Query(() => String)
    async testGraph(): Promise<string> {
        return "Test graph";
    }

    @Mutation((returns) => UserModel, { nullable: true })
    async createUser(@Args('createUserDto', CreateUserValidator) createUserDto: CreateUserDto) {
        try {
            const createUser = await this.userService.createUser(createUserDto);
            return plainToInstance(UserEntity, createUser);
        } catch (error) {
            throw new BadRequestException(`(UserResolver) createUser error: ${error?.message}`);
        }
    }

    @userAbilityParam({ action: Action.Update })
    @UseGuards(UserAbilityGuard)
    @UseGuards(GqlAuthGuard)
    @Mutation((returns) => UserModel, { nullable: true })
    async updateUser(
        @Args("_id") _id: string,
        @Args('updateUserDto', UpdateUserValidator) updateUserDto: UpdateUserDto) {
        try {
            const updateUser = await this.userService.updateUser(_id, updateUserDto);
            return plainToInstance(UserEntity, updateUser);
        } catch (error) {
            throw new BadRequestException(`(UserResolver) updateUser error: ${error?.message}`);
        }
    }

    @userAbilityParam({ action: Action.Read, subject: User })
    @UseGuards(UserAbilityGuard)
    @UseGuards(GqlAuthGuard)
    @Query((returns) => UserModel, { nullable: true })
    async findUserById(@Args("_id") userId: string) {
        try {
            const findUser = await this.userService.findUserById(userId);
            return plainToInstance(UserEntity, findUser);
        } catch (error) {
            throw new BadRequestException(`(UserResolver) updateUser error: ${error?.message}`);
        }
    }

    @userAbilityParam({ action: Action.Read, subject: User })
    @UseGuards(UserAbilityGuard)
    @UseGuards(GqlAuthGuard)
    @Query((returns) => UserModel, { nullable: true })
    async findUserByUsernameOrEmail(
        @Args("_id") _id: string,
        @Args("username", { nullable: true }) username: string,
        @Args("email", { nullable: true }) email: string) {
        try {
            const findUser = await this.userService.findUserByUsernameOrEmail({
                username, email,
            });
            return plainToInstance(UserEntity, findUser);
        } catch (error) {
            throw new BadRequestException(`(UserResolver) updateUser error: ${error?.message}`);
        }
    }

    @userAbilityParam({ action: Action.Delete })
    @UseGuards(UserAbilityGuard)
    @UseGuards(GqlAuthGuard)
    @Mutation((returns) => Boolean, { nullable: true })
    async deleteUser(@Args("_id") userId: string) {
        try {
            const deleteUser = await this.userService.deleteUser(userId);
            return deleteUser;
        } catch (error) {
            throw new BadRequestException(`(UserResolver) updateUser error: ${error?.message}`);
        }
    }

    @Mutation((returns) => Boolean, { nullable: true })
    async sendEmailOtpCode(@Args("sendEmailOtpCodeDto") sendEmailOtpCodeDto: SendEmailOtpCodeDto) {
        try {
            const sendEmail = await this.userService.sendEmailOtpCode(sendEmailOtpCodeDto);
            return sendEmail;
        } catch (error) {
            throw new BadRequestException(`(UserResolver) sendEmailOtpCode error: ${error?.message}`);
        }
    }

    @Mutation((returns) => Boolean, { nullable: true })
    async forgotPassword(
        @Args("username", { nullable: true }) username: string, @Args("email", { nullable: true }) email: string,
        @Args("otpCodeReceive") otpCodeReceive: string, @Args("newPassword") newPassword: string,
    ) {
        try {
            const forgotPwd = await this.userService.forgotPassword({ username, email }, otpCodeReceive, newPassword);
            return forgotPwd;
        } catch (error) {
            throw new BadRequestException(`(UserResolver) forgotPassword error: ${error?.message}`);
        }
    }

    @userAbilityParam({ action: Action.Update })
    @UseGuards(UserAbilityGuard)
    @UseGuards(GqlAuthGuard)
    @Mutation((returns) => Boolean, { nullable: true })
    async verifyEmail(@Args("_id") _id: string, @Args("otpCodeReceive") otpCodeReceive: string) {
        try {
            const sendEmail = await this.userService.verifyEmail(_id, otpCodeReceive);
            return sendEmail;
        } catch (error) {
            throw new BadRequestException(`(UserResolver) verifyEmail error: ${error?.message}`);
        }
    }

    @UseGuards(GqlAuthGuard)
    @Query((returns) => [UserModel], { nullable: true })
    async searchUser(@Args("searchUserRegex") searchUserRegex: string) {
        try {
            const find = await this.userService.searchUserRegex(searchUserRegex);
            return plainToInstance(UserEntity, find);
        } catch (error) {
            throw new BadRequestException(`(UserResolver) searchUser error: ${error?.message}`);
        }
    }

    @userAbilityParam({ action: Action.Update })
    @UseGuards(UserAbilityGuard)
    @UseGuards(GqlAuthGuard)
    @Mutation((returns) => UserModel, { nullable: true })
    async addConnectUser(@Args("_id") _id: string, @Args("connectId") connectId: string) {
        try {
            const update = await this.userService.addConnectUsers(_id, connectId);
            return plainToInstance(UserEntity, update);
        } catch (error) {
            throw new BadRequestException(`(UserResolver) addConnectUser error: ${error?.message}`);
        }
    }

    @userAbilityParam({ action: Action.Read, subject: User })
    @UseGuards(UserAbilityGuard)
    @UseGuards(GqlAuthGuard)
    @Query((returns) => [UserModel], { nullable: true })
    async findConnectUsers(@Args("_id") _id: string) {
        try {
            const finds = await this.userService.findConnectUsers(_id);
            const rs = finds.map((value) => plainToInstance(UserEntity, value));
            return rs;
        } catch (error) {
            throw new BadRequestException(`(UserResolver) findConnectUser error: ${error?.message}`);
        }
    }

    @userAbilityParam({ action: Action.Update })
    @UseGuards(UserAbilityGuard)
    @UseGuards(GqlAuthGuard)
    @Mutation((returns) => UserModel, { nullable: true })
    async deleteConnectUser(@Args("_id") _id: string, @Args("connectUserId") connectUserId: string) {
        try {
            const rs = await this.userService.deleteConnectUser(_id, connectUserId);
            return plainToInstance(UserEntity, rs);
        } catch (error) {
            throw new BadRequestException(`(UserResolver) findConnectUser error: ${error?.message}`);
        }
    }
}