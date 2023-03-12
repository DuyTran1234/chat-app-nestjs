import { BadRequestException, Controller, Param, Post, Put, Request, UnauthorizedException, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { plainToInstance } from "class-transformer";
import { JwtAuthGuard } from "src/authentication/guard/jwt-auth.guard";
import { LocalAuthGuard } from "src/authentication/guard/local-auth.guard";
import { AuthService } from "src/authentication/service/auth.service";
import { userAbilityParam } from "src/authorization/guard/ability.metadata";
import { UserAbilityGuard } from "src/authorization/guard/user-ability.guard";
import { Action } from "src/shared/enum/action.enum";
import { FileSize } from "src/shared/size.enum";
import { UserEntity } from "../entity/user.entity";
import { User } from "../schema/user.schema";
import { UserService } from "../service/user.service";

@Controller('user')
export class UserController {
    constructor(
        private authService: AuthService,
        private userService: UserService,
    ) { }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req: any) {
        try {
            return this.authService.jwtLogin(req?.user);
        } catch (error) {
            throw new UnauthorizedException(`Restricted user`);
        }
    }

    @UseInterceptors(FileInterceptor('avatar-file', {
        limits: {
            fileSize: FileSize.MaxSize,
            
        }
    }))
    @userAbilityParam({ action: Action.Update })
    @UseGuards(UserAbilityGuard)
    @UseGuards(JwtAuthGuard)
    @Put("/upload-avatar/:_id")
    async updateAvatar(@UploadedFile() file: Express.Multer.File, @Param("_id") _id: string): Promise<UserEntity> {
        try {
            const uploadAvatar = await this.userService.uploadUserAvatar(_id, file);
            return plainToInstance(UserEntity, uploadAvatar);
        } catch (error) {
            throw new BadRequestException(`(UserController) updateAvatar error: ${error?.message}`);
        }
    }

    @Post('test-email')
    async testEmail(): Promise<string> {
        try {
            const rs = await this.userService.sendEmailOtpCode({
                username: "duytv",
            });
            return rs ? "Send OTP code sent success" : "Send OTP code sent failed";
        } catch (error) {
            throw new BadRequestException(`(UserController) testEmail error: ${error?.message}`);
        }
    }

}