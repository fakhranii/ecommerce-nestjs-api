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

  findAll(): Promise<User[]> {
    return this.userModel.find().select('-password -__v -createdAt -updatedAt');
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
    user.active = false;
    await user.save();
    return {
      message: 'User is un sctive now',
      status: 200,
    };
  }
}
