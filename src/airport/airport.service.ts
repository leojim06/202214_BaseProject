import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { AirportEntity } from './airport.entity';

@Injectable()
export class AirportService {

    private readonly airportCodeValidator = new RegExp(/^[A-Z]{3}$/)

    constructor(
        @InjectRepository(AirportEntity)
        private readonly airportRepository: Repository<AirportEntity>
    ) { }

    async findAll(): Promise<AirportEntity[]> {
        return await this.airportRepository.find({ relations: ["airlines"] });
    }

    async findOne(id: string): Promise<AirportEntity> {
        const airport: AirportEntity = await this.airportRepository.findOne({ where: { id }, relations: ["airlines"] });
        if (!airport)
            throw new BusinessLogicException("The airport with the given id was not found", BusinessError.NOT_FOUND);
        return airport;
    }

    async create(airport: AirportEntity): Promise<AirportEntity> {
        if (!this.airportCodeValidator.test(airport.code))
            throw new BusinessLogicException("The airport code is incorrect", BusinessError.BAD_REQUEST)
        return await this.airportRepository.save(airport);
    }

    async update(id: string, airport: AirportEntity): Promise<AirportEntity> {
        return null;
    }
}
