import { Controller, Get, Post, Body, Patch, Param, Delete, Ip, Put, UseGuards, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { TestGuard } from './test.guard';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from './user.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @ResponseMessage("Create a new User")
  create(
    // @Body("email") myEmail: string,
    // @Body("password") password: string,
    // @Body("name") name: string,
    
    @Body() createUserDto: CreateUserDto,
    @Ip() ip: string
  ) {

    console.log("ip", ip);
    return this.usersService.create(createUserDto);
  }


  // @UseGuards(TestGuard)
  @Get()
  findAll(@Query("page") currrentPage: string, //req.query.page
  @Query("limit") limit: string,
  @Query() qs: string) {
    return this.usersService.findAll(+currrentPage, +limit, qs);
  }

  @Get(':id')
  @ResponseMessage("Get a new User")
  findOne(@Param('id') id: string) {

    //const id : string = request.params.id;
    return this.usersService.findOne(id);
  }

  @Patch()
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto);
  }

  @Delete(':id')
  @ResponseMessage("Delete a user")

  remove(@Param('id') id: string , @User() user : IUser) {
    return this.usersService.remove(id, user);
  }
}
