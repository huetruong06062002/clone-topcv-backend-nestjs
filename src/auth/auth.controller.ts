import { Body, Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Public, ResponseMessage } from "src/decorator/customize";
import { LocalAuthGuard } from "./local-auth.guard";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { RegisterUserDto } from "src/users/dto/create-user.dto";

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
  handleLogin(@Request() req) {
    return this.authService.login(req.user);
  }

  
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }


}
