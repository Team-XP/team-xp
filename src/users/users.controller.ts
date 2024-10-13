import {
  Controller,
  Post,
  Body,
  HttpCode,
  Get,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { IsPublic } from 'src/auth/decorators';
import { CreateUserDto } from './dto';
import { UsersService } from './users.service';
import { AuthRequest } from 'src/auth/models/auth-request';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @IsPublic()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('profile')
  getProfile(@Request() req: AuthRequest) {
    return req.user;
  }
}
