import { Body, Controller, Get, Post, Req, Request, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Public, ResponseMessage, User } from "src/decorator/customize";
import { LocalAuthGuard } from "./local-auth.guard";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { RegisterUserDto } from "src/users/dto/create-user.dto";
import { Response } from 'express';
import { IUser } from "src/users/user.interface";

@Controller("auth")
export class AuthController {
  constructor( private authService: AuthService) {

  }

  @Public()
  // @UseGuards(LocalAuthGuard)
  @ResponseMessage("Register a new user")
    @Post('/register')
    handleRegister(@Body() registerUserDto: RegisterUserDto) {
        return this.authService.register(registerUserDto);
    }


  @Public()
  @UseGuards(LocalAuthGuard)
  @ResponseMessage("User Login")

  @Post("/login")
  handleLogin(@Req() req, 
    @Res({ passthrough: true }) response: Response
  ) {
    return this.authService.login(req.user, response);
  }

  
  @ResponseMessage("Get User information")

  @Get('/account')
  getProfile(@User() user: IUser) { //request.user
    return {user };
  }


}
