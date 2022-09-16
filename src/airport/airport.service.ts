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

}
