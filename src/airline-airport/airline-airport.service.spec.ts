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

    it('addAirportToAirline shoud add an airport to an airline', async () => {
        const newAirport: AirportEntity = await airportRepository.save({
            name: faker.company.name(),
            code: faker.address.countryCode('alpha-3'),
            country: faker.address.country(),
            city: faker.address.cityName(),
            airlines: []
        });

        const newAirline: AirlineEntity = await airlineRepository.save({
            name: faker.company.name(),
            description: faker.lorem.sentence(),
            foundationDate: faker.date.past(),
            webPage: faker.internet.url(),
            airports: [],
        });

        const result: AirlineEntity = await service.addAirportToAirline(newAirline.id, newAirport.id);

        expect(result.airports.length).toBe(1);
        expect(result.airports[0]).not.toBeNull();
        expect(result.airports[0].name).toBe(newAirport.name);
        expect(result.airports[0].code).toBe(newAirport.code);
        expect(result.airports[0].country).toBe(newAirport.country);
        expect(result.airports[0].city).toBe(newAirport.city);
    });

    it('addAirportToAirline should throw an exception for an invalid airport', async () => { 
        const newAirline: AirlineEntity = await airlineRepository.save({
            name: faker.company.name(),
            description: faker.lorem.sentence(),
            foundationDate: faker.date.past(),
            webPage: faker.internet.url(),
            airports: [],
        });

        await expect(() => service.addAirportToAirline(newAirline.id, '0'))
            .rejects.toHaveProperty("message", "The airport with the given id was not found");
    });
});
