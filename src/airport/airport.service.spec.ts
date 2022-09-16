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

    it('create should return a new airport', async () => {
        const airport: AirportEntity = {
            id: "",
            name: faker.company.name(),
            code: faker.address.countryCode('alpha-3'),
            country: faker.address.country(),
            city: faker.address.cityName(),
            airlines: []
        }

        const newAirport: AirportEntity = await service.create(airport);
        expect(newAirport).not.toBeNull();

        const storedAirport: AirportEntity = await repository.findOne({ where: { id: newAirport.id } })
        expect(storedAirport).not.toBeNull();
        expect(storedAirport.name).toEqual(newAirport.name);
        expect(storedAirport.code).toEqual(newAirport.code);
        expect(storedAirport.country).toEqual(newAirport.country);
        expect(storedAirport.city).toEqual(newAirport.city);
    });
    
    it('create should throw an exception for an invalid airline foundation date', async () => {
        const airport: AirportEntity = {
            id: "",
            name: faker.company.name(),
            code: "ABCDEFG",
            country: faker.address.country(),
            city: faker.address.cityName(),
            airlines: []
        }

        await expect(() => service.create(airport))
            .rejects.toHaveProperty("message", "The airport code is incorrect");
    });

    it('update should modify an airport', async () => { 
        let airport: AirportEntity = airportList[0];
        airport = {
            ...airport, name: "New name", country: "New country name"
        };

        const updatedAirport: AirportEntity = await service.update(airport.id, airport);
        expect(updatedAirport).not.toBeNull();

        const storedAirline: AirportEntity = await repository.findOne({ where: { id: airport.id } });
        expect(storedAirline).not.toBeNull();
        expect(storedAirline.name).toEqual(airport.name);
        expect(storedAirline.country).toEqual(airport.country);
    });

    it('update should throw an exception for an invalid airport id', async () => {
        let airport: AirportEntity = airportList[0];
        airport = {
            ...airport, name: "New name", country: "New country name"
        };

        await expect(() => service.update('0', airport))
            .rejects.toHaveProperty("message", "The airport with the given id was not found");
    });
});
