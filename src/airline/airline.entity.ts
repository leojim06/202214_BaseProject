import { AirportEntity } from 'src/airport/airport.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';

@Entity()
export class AirlineEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    foundationDate: Date;

    @Column()
    webPage: string;

    @ManyToMany(() => AirportEntity, airport => airport.airlines)
    airports?: AirportEntity[];
    
}
