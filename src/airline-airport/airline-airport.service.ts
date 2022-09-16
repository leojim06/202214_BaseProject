import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AirlineEntity } from '../airline/airline.entity';
import { AirportEntity } from '../airport/airport.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class AirlineAirportService {

    constructor(
        @InjectRepository(AirlineEntity)
        private readonly airlineRepository: Repository<AirlineEntity>,

        @InjectRepository(AirportEntity)
        private readonly airportRepository: Repository<AirportEntity>
    ) { }

    async addAirportToAirline(airlineId: string, airportId: string): Promise<AirlineEntity> {
        const airport: AirportEntity = await this.airportRepository.findOne({ where: { id: airportId } });
        if (!airport)
            throw new BusinessLogicException("The airport with the given id was not found", BusinessError.NOT_FOUND);
            
        const airline: AirlineEntity = await this.airlineRepository.findOne({ where: { id: airlineId }, relations: ["airports"] });

        airline.airports = [...airline.airports, airport];

        return await this.airlineRepository.save(airline);
    }

}