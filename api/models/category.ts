import { Column, ForeignKey, Model, Table, HasMany, BelongsTo, Scopes } from 'sequelize-typescript';
import { SubCategory } from './SubCategory';
import { Mode } from './Mode';

@Scopes(() => ({
    allByMode: (modeId: number) => ({
        include: [SubCategory],
        where: {
            modeId: modeId,
        },
    })
}))
@Table({
    timestamps: false,
})
export class Category extends Model<Category> {
    @Column
    name: string;

    @ForeignKey(() => Mode)
    @Column
    modeId: number;
    
    @HasMany(() => SubCategory)
    subCategories: SubCategory[];
}

export enum Categories {
    Beatmaps = 'beatmaps',
    Genre = 'genre',
    Mappers = 'mappers'
}