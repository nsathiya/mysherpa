import { Controller, Post, Body, Patch, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() body: { firebaseUid: string; email: string }) {
    const user = await this.userService.createUser(body.firebaseUid, body.email);
    // Return only safe fields
    return {
      id: user.id,
      firebaseUid: user.firebaseUid,
      email: user.email,
      createdAt: user.createdAt,
      adventureStyle: user.adventureStyle,
      touristVibe: user.touristVibe,
      landscapePreferences: user.landscapePreferences,
      paceOfDay: user.paceOfDay,
    };
  }

  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() body: Partial<{ adventureStyle: string; touristVibe: string; landscapePreferences: string[]; paceOfDay: string }>) {
    const user = await this.userService.updateUser(id, body);
    return {
      id: user.id,
      firebaseUid: user.firebaseUid,
      email: user.email,
      createdAt: user.createdAt,
      adventureStyle: user.adventureStyle,
      touristVibe: user.touristVibe,
      landscapePreferences: user.landscapePreferences,
      paceOfDay: user.paceOfDay,
    };
  }
} 