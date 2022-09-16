import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AirportEntity } from './airport.entity';

@Injectable()
export class AirportService {

    constructor(
        @InjectRepository(AirportEntity)
        private readonly airportRepository: Repository<AirportEntity>
    ) { }

    async findAll(): Promise<AirportEntity[]> {
        return await this.airportRepository.find({ relations: ["airlines"] });
    }

    async findOne(id: string): Promise<AirportEntity> {
        const airport: AirportEntity = await this.airportRepository.findOne({ where: { id }, relations: ["airlines"] });
        return airport;
    }

}
