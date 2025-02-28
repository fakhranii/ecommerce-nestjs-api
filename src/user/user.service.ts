import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    const password = await bcrypt.hash(
      createUserDto.password,
      await bcrypt.genSalt(10),
    );

    const user = await this.userModel.findOne({ email: createUserDto.email });
    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    return await this.userModel.create({ ...createUserDto, password });
  }

  async findAll(query: any): Promise<{
    data: User[];
    status: number;
    length: number;
    message: string;
  }> {
    const {
      limit = 1000000,
      skip = 0,
      sort = 'asc',
      page,
      name,
      email,
      role,
    } = query;

    if (
      Number.isNaN(Number(+limit)) ||
      Number.isNaN(Number(+page)) ||
      Number.isNaN(Number(+skip))
    ) {
      throw new HttpException(
        'Page and limit and skip must be a number',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!['desc', 'asc'].includes(sort)) {
      throw new HttpException(
        'sort must be asc or desc',
        HttpStatus.BAD_REQUEST,
      );
    }

    const users = await this.userModel
      .find()
      .skip(skip)
      .limit(limit)
      // .or([{ name }, { email }, { role }]) // or => search by the full keyword (you should send the full word)
      .where('name', new RegExp(name, 'i')) // regex search by any part of the word
      .where('email', new RegExp(email, 'i')) // you should to avoid using where because it's bad for performance
      .where('role', new RegExp(role, 'i'))
      .sort({ name: sort })
      .select('-password -__v -createdAt -updatedAt');

    return {
      status: 200,
      data: users,
      length: users.length,
      message: 'All users',
    };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel
      .findById(id)
      .select('-password -__v -createdAt -updatedAt');
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userModel
      .findById(id)
      .select('-password -__v -createdAt -updatedAt');
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        await bcrypt.genSalt(10),
      );
    }
    return this.userModel.findByIdAndUpdate(user._id, updateUserDto, {
      new: true,
    });
  }

  async remove(id: string): Promise<{ message: string; status: number }> {
    const user = await this.userModel
      .findById(id)
      .select('-password -__v -createdAt -updatedAt');
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    user.active = false;
    await user.save();
    return {
      message: 'User is un sctive now',
      status: 200,
    };
  }

  // ================== For User Operations ==================
  async getMe(req: any): Promise<User> {
    const user = await this.userModel
      .findById(req._id)
      .select('-password -__v');
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async updateMe(req: any, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userModel
      .findById(req._id)
      .select('-password -__v -createdAt -updatedAt');
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        await bcrypt.genSalt(10),
      );
    }
    return this.userModel.findByIdAndUpdate(user._id, updateUserDto, {
      new: true,
    });
  }

  async deleteMe(req: any): Promise<{ message: string; status: number }> {
    const user = await this.userModel.findById(req._id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    user.active = false;
    await user.save();
    return {
      message: 'User is un sctive now',
      status: 200,
    };
  }
}
