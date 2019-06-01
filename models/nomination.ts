import {Table, Column, Model, ForeignKey, AllowNull, BelongsTo, DefaultScope} from 'sequelize-typescript';
import { User } from './user';
import { Beatmapset } from './beatmapset';
import { Category } from './category';

@DefaultScope({
    include: [
        {
            as: 'user',
            model: () => User,
        },
        {
            model: () => Beatmapset,
        },
    ]
})
@Table({
    timestamps: true,
})
export class Nomination extends Model<Nomination> {
    @ForeignKey(() => User)
    @AllowNull(false)
    @Column
    nominatorId: number;

    @ForeignKey(() => Category)
    @AllowNull(false)
    @Column
    categoryId: number;
    
    @BelongsTo(() => Category)
    category: Category;

    @ForeignKey(() => Beatmapset)
    @Column
    beatmapsetId: number;

    @BelongsTo(() => Beatmapset)
    beatmapset: Beatmapset;

    @ForeignKey(() => User)
    @Column
    userId: number;

    @BelongsTo(() => User, 'userId')
    user: User;
}
