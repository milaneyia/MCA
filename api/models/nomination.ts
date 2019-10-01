import { AllowNull, BelongsTo, Column, DefaultScope, ForeignKey, Model, Table, Scopes } from 'sequelize-typescript';
import { Beatmapset } from './Beatmapset';
import { User } from './User';
import { SubCategory } from './SubCategory';
import { Category, Categories } from './Category';
import { Op } from 'sequelize';

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
@Scopes(() => ({
    allByModeAndNominator: (modeId: number, nominatorId: number) => ({
        include: [{
            model: SubCategory,
            include: [{
                model: Category,
                where: {
                    modeId: modeId,
                },
            }]
        }],
        where: {
            nominatorId: nominatorId,
        },
    }),
    allBeatmapsNominationsByMode: (modeId: number) => ({
        include: [{
            model: SubCategory,
            include: [{
                model: Category,
                where: {
                    name: {
                        [Op.or]: [Categories.Beatmaps, Categories.Genre],
                    },
                    modeId: modeId,
                },
            }]
        }],
    }),
    allMappersNominationsByMode: (modeId: number) => ({
        include: [{
            model: SubCategory,
            include: [{
                model: Category,
                where: {
                    name: Categories.Mappers,
                    modeId: modeId,
                },
            }]
        }],
    }),
}))
@Table({
    timestamps: true,
})
export class Nomination extends Model<Nomination> {
    @ForeignKey(() => User)
    @AllowNull(false)
    @Column
    nominatorId: number;

    @BelongsTo(() => User, 'nominatorId')
    nominator: User;
    
    @ForeignKey(() => SubCategory)
    @AllowNull(false)
    @Column
    subCategoryId: number;
    
    @BelongsTo(() => SubCategory)
    subCategory: SubCategory;

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
