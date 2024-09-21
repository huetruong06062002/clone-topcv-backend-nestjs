import { CreateUserDto } from './dto/create-user.dto';
import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { genSaltSync, hashSync ,compareSync } from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

@Injectable() //provider
export class UsersService {
  // create(createUserDto: CreateUserDto) {
  //   return 'This action adds a new user';
  // }
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>
  ) {

  }

  hashPassword = (password: string) => {
    var salt = genSaltSync(10);
    var hashPassword = hashSync(password, salt);
    return hashPassword;
  }

  async create(createUserDto: CreateUserDto) {

    const createdUser = await this.userModel.create({
      ...createUserDto,
      password: this.hashPassword(createUserDto.password)
    });

    return createdUser.save();
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: string) {
    try {
      return await this.userModel.findOne({_id : id}) ;
    }catch (error){
        return "Not found user";
    }  
  }


  async findOneByUsername(username: string) {
    return await this.userModel.findOne({email : username}) ;
  }

  isValidPassword(password: string, hashPassword: string){
    return compareSync(password, hashPassword);
  }


  async update(updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne({_id : updateUserDto._id}, {...updateUserDto})
  }

  async remove(id: string) {
    return this.userModel.softDelete({_id : id});
  }
}
