import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from "passport-jwt";
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { User } from "src/users/entities/user.entity";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { UsersService } from "src/users/users.service";

@Injectable()
export class JwtStrategy 
extends PassportStrategy(Strategy) 
{

    constructor(
        private readonly configService: ConfigService,  
        private readonly usersService: UsersService
    ) {
        super({
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        })
    }

    async validate(payload: JwtPayload): Promise<User> {
        const { username } = payload;
        const user = await this.usersService.findByUsername(username);

        if (!user) {
            throw new UnauthorizedException('Token is not valid');
        }

        if (!user.isActive) {
            throw new UnauthorizedException('User is not active');
        }

        return user;
    }

}