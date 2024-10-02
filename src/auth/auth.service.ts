import { UserSchema } from './../users/schemas/user.schema';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/user.interface';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { Response } from 'express';

@Injectable()
export class AuthService {

  constructor(
    private usersService: UsersService, 
    private jwtService: JwtService,
    private readonly configService: ConfigService
  ) { }


  //username/ pass là 2 tham số thư viện passpaort nó ném về
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);

    if (user) {
      const isValid = this.usersService.isValidPassword(pass, user.password);
      if (isValid == true) {
        return user;
      }
    }

    return null;
  }

  async register(user: RegisterUserDto) {
    let newUser = await this.usersService.register(user);

    return {
        _id: newUser?._id,
        createdAt: newUser?.createdAt
    };

  }

  async login(user: IUser, response: Response) {
    const { _id, name, email, role } = user;
    const payload = {
      sub: "token login",
      iss: "from server",
      _id,
      name,
      email,
      role
    };

    const refresh_token = this.createRefeshToken(payload);


    //update user with refresh token

    await this.usersService.updateUserToken(refresh_token, _id);

    //set refresh token as coookies
    response.cookie('refreshToken', refresh_token , {
      httpOnly: true,
      maxAge: ms(this.configService.get<string>('JWT_REFRESH__EXPIRE'))   //milisecond
    });

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token,
      user: {
        _id,
        name,
        email,
        role
      }
    };
  }


  createRefeshToken = (payload) => {
    const refreshtoken = this.jwtService.sign(payload, {
      secret : this.configService.get<string>('JWT_REFRESH_TOKEN'),
      expiresIn : ms(this.configService.get<string>('JWT_REFRESH__EXPIRE')) / 1000 // ms to second : thư viện jwt dùng second
    });

    return refreshtoken;
  }

}
