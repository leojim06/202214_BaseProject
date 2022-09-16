import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AirlineEntity } from '../airline/airline.entity';
import { AirportEntity } from '../airport/airport.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { AirlineAirportService } from './airline-airport.service';
import { faker } from '@faker-js/faker';

describe('AirlineAirportService', () => {
    let service: AirlineAirportService;
    let airlineRepository: Repository<AirlineEntity>;
    let airportRepository: Repository<AirportEntity>;
    let airline: AirlineEntity;
    let airportList: AirportEntity[];

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [...TypeOrmTestingConfig()],
            providers: [AirlineAirportService],
        }).compile();

        service = module.get<AirlineAirportService>(AirlineAirportService);
        airlineRepository = module.get<Repository<AirlineEntity>>(getRepositoryToken(AirlineEntity));
        airportRepository = module.get<Repository<AirportEntity>>(getRepositoryToken(AirportEntity));

        await seedDatabase();
    });

    const seedDatabase = async () => {
        airlineRepository.clear();
        airportRepository.clear();

        airportList = [];
        for (let i = 0; i < 5; i++) {
            const airport: AirportEntity = await airportRepository.save({
                name: faker.company.name(),
                code: faker.address.countryCode('alpha-3'),
                country: faker.address.country(),
                city: faker.address.cityName(),
                airlines: []
            });
            airportList.push(airport);
        }

        airline = await airlineRepository.save({
            name: faker.company.name(),
            description: faker.lorem.sentence(),
            foundationDate: faker.date.past(),
            webPage: faker.internet.url(),
            airports: airportList,
        });
    };

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
