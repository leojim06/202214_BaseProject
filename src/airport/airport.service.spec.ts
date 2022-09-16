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
});
