import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Career } from '../../Infrastructure/Entities/Career.orm.entity';
import { Repository } from 'typeorm';
import { join } from 'path';
import { readFile } from 'fs/promises';

@Injectable()
export class CareerSeedService {
  private readonly logger = new Logger(CareerSeedService.name);

  constructor(
    @InjectRepository(Career)
    private readonly careerRepository: Repository<Career>,
  ) {}

  async seedCareer() {
    try {
      const filePath = join(__dirname, '../CareersData.json');
      const fileContent = await readFile(filePath, 'utf-8');
      const careers = JSON.parse(fileContent);

      for (const careerData of careers) {
        const existingCareer = await this.careerRepository.existsBy({
          Name: careerData.Name,
        });

        if (existingCareer) {
          continue;
        }

        const career = await this.careerRepository.create({
          ...careerData,
        });
        await this.careerRepository.save(career);
      }
      this.logger.log('The career seeder task has finished without problems');
    } catch (error) {
      this.logger.error(error);
    }
  }
}
