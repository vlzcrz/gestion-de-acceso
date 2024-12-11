import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Career as CareerORM } from '../Entities/Career.orm.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CareerRepository {
  constructor(
    @InjectRepository(CareerORM)
    private readonly careerRepository: Repository<CareerORM>,
  ) {}

  async GetCareerById(careerId): Promise<CareerORM | null> {
    const career = await this.careerRepository.findOneBy({
      Career_id: careerId,
    });
    if (!career) {
      throw new NotFoundException(
        'The career id has not been found, try again',
      );
    }
    return career;
  }
}
