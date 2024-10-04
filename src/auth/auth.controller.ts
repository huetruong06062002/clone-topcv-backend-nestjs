import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { Request } from 'express';
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
  handleGetAccount(@User() user: IUser) { //request.user
    return {user };
  }



  @Public()
  @ResponseMessage("Get User by refresh token")
  @Get('/refresh')
  handleRefreshToken(@Req() request: Request) { //request.user
   
    const refreshToken = request.cookies["refreshToken"];
    
    return this.authService.proccessNewToken(refreshToken);

  }


}
