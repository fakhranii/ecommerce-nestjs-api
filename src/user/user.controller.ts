import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/decorators/Roles.decorator';
import { AuthGuard } from './guards/auth.guard';

@UseGuards(AuthGuard)
@Roles(['admin']) // to use this route, the user must have the role of admin
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * @docs admin could create a user
   * @route POST api/v1/user
   * @access private admin
   * @returns new user
   */
  @Post()
  create(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  /**
   * @docs admin could get all users
   * @route GET api/v1/user
   * @access private admin
   * @returns all users
   */
  @Get()
  findAll(@Query() query) {
    return this.userService.findAll(query);
  }

  /**
   * @docs admin could get single user
   * @route GET api/v1/user/:id
   * @access private admin
   * @returns single user
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  /**
   * @docs admin could update single user
   * @route PATCH api/v1/user/:id
   * @access private admin
   * @returns updated single user
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  /**
   * @docs admin could delete single user
   * @route DELETE api/v1/user/:id
   * @access private admin
   * @returns deleted single user
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
