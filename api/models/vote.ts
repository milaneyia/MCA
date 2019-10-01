import { Table, Column, Model, ForeignKey, BelongsTo, DefaultScope, Scopes } from 'sequelize-typescript';
import { Nomination } from './Nomination';
import { User } from './User';
import { SubCategory } from './SubCategory';
import { Category } from './Category';

@DefaultScope({
    include: [
        {
            model: () => Nomination,
        },
    ]
})
@Scopes(() => ({
    allByModeAndUser: (modeId: number, userId: number) => ({
        include: [{
            model: Nomination,
            include: [{
                model: SubCategory,
                include: [{
                    model: Category,
                    where: {
                        modeId: modeId,
                    },
                }],
            }],
        }],
        where: {
            userId: userId,
        },
    })
}))
@Table({
    timestamps: true,
})
export class Vote extends Model<Vote> {
    @Column
    points: number;
    
    @ForeignKey(() => User)
    @Column
    userId: number;

    @ForeignKey(() => Nomination)
    @Column
    nominationId: number;

    @BelongsTo(() => Nomination)
    nomination: Nomination;
}
