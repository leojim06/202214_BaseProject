import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AirlineEntity } from '../airline/airline.entity';
import { AirportEntity } from '../airport/airport.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AirlineAirportService {

    constructor(
        @InjectRepository(AirlineEntity)
        private readonly airlineRepository: Repository<AirlineEntity>,

        @InjectRepository(AirportEntity)
        private readonly airportRepository: Repository<AirportEntity>
    ) { }

}
