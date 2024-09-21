import { Controller, Get, Post, Body, Patch, Param, Delete, Ip, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { TestGuard } from './test.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
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
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {

    //const id : string = request.params.id;
    return this.usersService.findOne(id);
  }

  @Put()
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
