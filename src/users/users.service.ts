import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from './user.interface';
import aqp from 'api-query-params';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>
  ) {}

  // Password hashing utility
  hashPassword = (password: string): string => {
    const salt = genSaltSync(10);
    return hashSync(password, salt);
  };

  // Register a new user
  async register(registerUserDTO: RegisterUserDto) {
    const { name, email, password, age, gender, address } = registerUserDTO;

    // Check if the email already exists
    const isExist = await this.userModel.findOne({ email });
    if (isExist) {
      throw new BadRequestException(`Email: ${email} đã tồn tại trên hệ thống. Vui lòng sử dụng email khác.`);
    }

    const hashPassword = this.hashPassword(password);
    const newRegister = await this.userModel.create({
      name,
      email,
      password: hashPassword,
      age,
      gender,
      address,
      role: "USER",
    });

    return newRegister;
  }

  // Create a user (admin use-case)
  async create(createUserDto: CreateUserDto) {

    const createdUser = await this.userModel.create({
      ...createUserDto,
      role: createUserDto.role,
      password: this.hashPassword(createUserDto.password),
    });

    return {
      _id: createdUser._id,
      createdAt: createdUser.createdAt,
    };
  }

  // Find all users with pagination and query support
  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    const offset = (+currentPage - 1) * (+limit);
    const defaultLimit = +limit || 10;

    const totalItems = await this.userModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.userModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .select('-password')
      .populate(population)
      .exec();

    return {
      meta: {
        current: currentPage,
        pageSize: limit,
        pages: totalPages,
        total: totalItems,
      },
      result,
    };
  }

  // Find a user by ID
  async findOne(id: string) {
    try {
      return await this.userModel.findOne({ _id: id }).select('-password');
    } catch (error) {
      return "Not found user";
    }
  }

  // Find a user by username (email)
  async findOneByUsername(username: string) {
    return await this.userModel.findOne({ email: username });
  }

  // Validate password
  isValidPassword(password: string, hashPassword: string) {
    return compareSync(password, hashPassword);
  }

  // Update user details
  async update(updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne({ _id: updateUserDto._id }, updateUserDto);
  }

  // Soft delete a user
  async remove(id: string, user: IUser) {
    await this.userModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      }
    );
    return this.userModel.softDelete({ _id: id });
  }

  // Update user refresh token
  async updateUserToken(refreshToken: string, _id: string) {
    await this.userModel.updateOne({ _id }, { refreshToken });
  }

  // Find user by refresh token
  async findUserByToken(refreshToken: string) {
    return await this.userModel.findOne({ refreshToken });
  }
}
