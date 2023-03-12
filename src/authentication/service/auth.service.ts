import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { plainToInstance } from "class-transformer";
import { HashGenerator } from "src/shared/hash-generator";
import { UserEntity } from "src/user/entity/user.entity";
import { UserService } from "src/user/service/user.service";

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) { }

    async validateUser(userInput: string, passwordInput: string) {
        try {
            const user = await this.userService.findUserByUsernameOrEmail({
                username: userInput,
                email: userInput,
            });
            if (user) {
                const compare = await HashGenerator.compare(passwordInput, user.password);
                if (compare) {
                    return plainToInstance(UserEntity, user);
                }
            }
            return null;
        } catch (error) {
            throw new UnauthorizedException(`(AuthService) validateUser error: ${error?.message}`);
        }
    }

    async jwtLogin(user: UserEntity) {
        const payload = {
            _id: user._id,
            username: user.username,
            email: user.email,
        };
        return {
            accessToken: this.jwtService.sign(payload),
        };
    }
}