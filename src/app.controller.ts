import { Controller, Get, Post, Render, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { Public } from './decorator/customize';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly configService: ConfigService, private authService: AuthService) {

  }

  @Get() //route " " => /api

  @Render("home")
  handleHomePage() {

    //get port from .enc
    console.log(">>>check port = ", this.configService.get<string>("PORT"));

    const message = this.appService.getHello();
    // return "this.appService.getHello()";

    return {
      message : message
    }
  }


  
  @Get("/vc")
  getHello1(): string {
    return "this.appService.getHello()" ;
  }



}
