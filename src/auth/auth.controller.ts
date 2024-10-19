import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { Request } from 'express';
import { AuthService } from "./auth.service";
import { Public, ResponseMessage, User } from "src/decorator/customize";
import { LocalAuthGuard } from "./local-auth.guard";

import { RegisterUserDto } from "src/users/dto/create-user.dto";
import { Response } from 'express';
import { IUser } from "src/users/user.interface";
import { RolesService } from "src/roles/roles.service";
import { Throttle, ThrottlerGuard } from "@nestjs/throttler";

@Controller("auth")
export class AuthController {
  constructor(
     private authService: AuthService,
     private rolesService: RolesService,
    ) {

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
  @UseGuards(ThrottlerGuard)
  @Throttle(5, 60)
  @ResponseMessage("User Login")
  @Post("/login")
  handleLogin(@Req() req, 
    @Res({ passthrough: true }) response: Response
  ) {
    return this.authService.login(req.user, response);
  }

  
  @ResponseMessage("Get user information")
  @Get('/account')
  async handleGetAccount(@User() user: IUser) {
      const temp = await this.rolesService.findOne(user.role._id) as any;
      user.permissions = temp.permissions;
      return { user };
  }
s



  @Public()
  @ResponseMessage("Get User by refresh token")
  @Get('/refresh')
  handleRefreshToken(@Req() request: Request,  @Res({ passthrough: true }) response: Response) { //request.user
   
    const refreshToken = request.cookies["refreshToken"];
    
    return this.authService.proccessNewToken(refreshToken, response);

  }



  @ResponseMessage("Logout User")
  @Post('/logout')
  handleLogout(  @Res({ passthrough: true }) response: Response, @User() user: IUser) { //request.user
   
    return this.authService.logout(response, user);

  }


}
