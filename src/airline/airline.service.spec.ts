import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { AirlineEntity } from './airline.entity';
import { AirlineService } from './airline.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('AirlineService', () => {
    let service: AirlineService;
    let repository: Repository<AirlineEntity>;
    let airlineList: AirlineEntity[];

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [...TypeOrmTestingConfig()],
            providers: [AirlineService],
        }).compile();

        service = module.get<AirlineService>(AirlineService);
        repository = module.get<Repository<AirlineEntity>>(getRepositoryToken(AirlineEntity));
        await seedDatabase();
    });

    const seedDatabase = async () => {
        repository.clear();
        airlineList = [];
        for (let i = 0; i < 5; i++) {
            const airline: AirlineEntity = await repository.save({
                name: faker.company.name(),
                description: faker.lorem.sentence(),
                foundationDate: faker.date.past(),
                webPage: faker.internet.url(),
                airports: [],
            });
            airlineList.push(airline);
        }
    };

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('findAll should return all airlines', async () => {
        const airlines: AirlineEntity[] = await service.findAll();
        expect(airlines).not.toBeNull();
        expect(airlines).toHaveLength(airlineList.length);
    });

    it('findOne should return an airline by id', async () => {
        const storedAirline: AirlineEntity = airlineList[0];
        const airline: AirlineEntity = await service.findOne(storedAirline.id);
        expect(airline).not.toBeNull();
        expect(airline.name).toEqual(storedAirline.name);
        expect(airline.description).toEqual(storedAirline.description);
        expect(airline.foundationDate).toEqual(storedAirline.foundationDate);
        expect(airline.webPage).toEqual(storedAirline.webPage);
    });

    it('findOne should throw an exception for an invalid airline id', async () => {
        await expect(() => service.findOne('0'))
            .rejects.toHaveProperty("message", "The airline with the given id was not found");
    });

    it('create should return a new museum', async () => {
        const airline: AirlineEntity = {
            id: "",
            name: faker.company.name(),
            description: faker.lorem.sentence(),
            foundationDate: faker.date.past(),
            webPage: faker.internet.url(),
            airports: [],
        }

        const newAirline: AirlineEntity = await service.create(airline);
        expect(newAirline).not.toBeNull();

        const storedAirline: AirlineEntity = await repository.findOne({ where: { id: newAirline.id } })
        expect(storedAirline).not.toBeNull();
        expect(storedAirline.name).toEqual(newAirline.name);
        expect(storedAirline.description).toEqual(newAirline.description);
        expect(storedAirline.foundationDate).toEqual(newAirline.foundationDate);
        expect(storedAirline.webPage).toEqual(newAirline.webPage);
    });

    it('create should throw an exception for an invalid airline foundation date', async () => {
        const airline: AirlineEntity = {
            id: "",
            name: faker.company.name(),
            description: faker.lorem.sentence(),
            foundationDate: faker.date.future(),
            webPage: faker.internet.url(),
            airports: [],
        }

        await expect(() => service.create(airline))
            .rejects.toHaveProperty("message", "The foundation date is incorrect");
    });

    it('update should modify an airline', async () => {
        let airline: AirlineEntity = airlineList[0];
        airline = {
            ...airline, name: "New name", description: "New description"
        };

        const updatedAirline: AirlineEntity = await service.update(airline.id, airline);
        expect(updatedAirline).not.toBeNull();

        const storedAirline: AirlineEntity = await repository.findOne({ where: { id: airline.id } });
        expect(storedAirline).not.toBeNull();
        expect(storedAirline.name).toEqual(airline.name);
        expect(storedAirline.description).toEqual(airline.description);
    });

    it('update should throw an exception for an invalid airline id', async () => {
        let airline: AirlineEntity = airlineList[0];
        airline = {
            ...airline, name: "New name", description: "New description"
        };

        await expect(() => service.update('0', airline))
            .rejects.toHaveProperty("message", "The airline with the given id was not found");
    });

    it('update should throw an exception for an invalid airline foundation date', async () => {
        let airline: AirlineEntity = airlineList[0];
        airline = {
            ...airline, foundationDate: faker.date.future()
        };

        await expect(() => service.update(airline.id, airline))
            .rejects.toHaveProperty("message", "The foundation date is incorrect");
    });

    it('delete should remove an airline', async () => {
        const airline: AirlineEntity = airlineList[0];
        await service.delete(airline.id);
        const deletedAirline: AirlineEntity = await repository.findOne({ where: { id: airline.id } });
        expect(deletedAirline).toBeNull();
    });

    it('delete should throw an exception for an invalid airline id', async () => {
        await expect(() => service.delete('0'))
            .rejects.toHaveProperty("message", "The airline with the given id was not found");
    });
});
