import {Table, Column, Model, HasMany, AllowNull, PrimaryKey, ForeignKey} from 'sequelize-typescript';
import { User } from './user';
import { Beatmapset } from './beatmapset';

@Table({
    timestamps: true,
})
export class Vote extends Model<Vote> {
    @Column
    vote: number;
    
    @ForeignKey(() => User)
    @Column
    userId: number;

    @ForeignKey(() => Beatmapset)
    @Column
    beatmapsetId: number;
}
