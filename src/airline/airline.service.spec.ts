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

    it('findOne should return an airline by id', async ()=>{
        const storedAirline: AirlineEntity = airlineList[0];
        const airline: AirlineEntity = await service.findOne(storedAirline.id);
        expect(airline).not.toBeNull();
        expect(airline.name).toEqual(storedAirline.name);
        expect(airline.description).toEqual(storedAirline.description);
        expect(airline.foundationDate).toEqual(storedAirline.foundationDate);
        expect(airline.webPage).toEqual(storedAirline.webPage);
    });

    it('findOne should throw an exception for an invalid airline', async () => { 
        await expect(() => service.findOne('0'))
            .rejects.toHaveProperty("message", "The airline with the given id was not found");
    });
});
