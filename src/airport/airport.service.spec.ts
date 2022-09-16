import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { AirportEntity } from './airport.entity';
import { AirportService } from './airport.service';
import { faker } from '@faker-js/faker';

describe('AirportService', () => {
    let service: AirportService;
    let repository: Repository<AirportEntity>;
    let airportList: AirportEntity[];

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [...TypeOrmTestingConfig()],
            providers: [AirportService],
        }).compile();

        service = module.get<AirportService>(AirportService);
        repository = module.get<Repository<AirportEntity>>(getRepositoryToken(AirportEntity));
        await seedDatabase();
    });

    const seedDatabase = async () => {
        repository.clear();
        airportList = [];
        for (let i = 0; i < 5; i++) {
            const airport: AirportEntity = await repository.save({
                name: faker.company.name(),
                code: faker.address.countryCode('alpha-3'),
                country: faker.address.country(),
                city: faker.address.cityName(),
                airlines: []
            });
            airportList.push(airport);
        }
    };

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('findAll should return all airports', async () => {
        const airports: AirportEntity[] = await service.findAll();
        expect(airports).not.toBeNull();
        expect(airports).toHaveLength(airportList.length);
    });

    it('findOne should return an airport by id', async () => {
        const storedairport: AirportEntity = airportList[0];
        const airport: AirportEntity = await service.findOne(storedairport.id);
        expect(airport).not.toBeNull();
        expect(airport.name).toEqual(storedairport.name);
        expect(airport.code).toEqual(storedairport.code);
        expect(airport.country).toEqual(storedairport.country);
        expect(airport.city).toEqual(storedairport.city);
    });

    it('findOne should throw an exception for an invalid airport id', async () => {
        await expect(() => service.findOne('0'))
            .rejects.toHaveProperty("message", "The airport with the given id was not found");
    });
});
