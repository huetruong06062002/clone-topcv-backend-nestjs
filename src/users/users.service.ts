import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { genSaltSync, hashSync ,compareSync } from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from './user.interface';
import { isEmpty } from 'class-validator';
import aqp from 'api-query-params';

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


  async register(registerUserDTO : RegisterUserDto){
    const { name, email, password, age, gender, address } = registerUserDTO;
    //add logic check email
    const isExist = await this.userModel.findOne({ email });
    if (isExist) {
      throw new BadRequestException(`Email: ${email} đã tồn tại trên hệ thống. Vui lòng sử dụng email khác.`)
    }
    const hashPassword = this.hashPassword(password);
    let newRegister = await this.userModel.create({
      name, email,
      password: hashPassword,
      age : age,
      gender,
      address,
      role: "USER"
    })
    return newRegister;

  }

  async create(createUserDto: CreateUserDto) {

    const createdUser = await this.userModel.create({
      ...createUserDto,
      password: this.hashPassword(createUserDto.password)
    });

    return {
      _id: createdUser._id,
      createdAt : createdUser.createdAt,
    };
  }

  async findAll(currentPage : number, limit : number, qs : string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);


    const result = await this.userModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .select('-password')
      .populate(population)
      .exec();


    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages,  //tổng số trang với điều kiện query
        total: totalItems // tổng số phần tử (số bản ghi)
      },
      result //kết quả query
    }

  
      
  }

  async findOne(id: string) {
    try {
      return await this.userModel.findOne({_id : id}).select('-password');;
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
     const updatedUser = await this.userModel.updateOne({_id : updateUserDto._id}, {...updateUserDto})

     return updatedUser;
  }

  async remove(id: string ,  user: IUser) {
    await this.userModel.updateOne(
      {_id :id},
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        }
      }
    )
    return this.userModel.softDelete({_id : id });
  }


   updateUserToken = async (refreshToken: string, _id: string) => {
     await  this.userModel.updateOne(
      {_id},
      { refreshToken }
    )
  }

  findUserByToken = async (refreshToken: string) => {
   return await  this.userModel.findOne(
      { refreshToken }  
   )
 }
} 
