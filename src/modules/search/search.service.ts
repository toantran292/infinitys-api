import { Injectable } from '@nestjs/common';
import { CreateSearchDto } from './dto/create-search.dto';
import { UpdateSearchDto } from './dto/update-search.dto';
import { UsersService } from '../users/users.service';
import { ILike } from 'typeorm';

@Injectable()
export class SearchService {
  constructor(private usersService: UsersService) {
  }

  async searchUser(query: string) {
    if(!query) return [];

    const users = await this.usersService.findAll({
      where: [
        { firstName: ILike(`%${query}%`), active: true },
        { lastName: ILike(`%${query}%`), active: true },
        { email: ILike(`%${query}%`), active: true },
      ]
    })

    return users;
  }
}
