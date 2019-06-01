import {Table, Column, Model, ForeignKey, BelongsTo, DefaultScope} from 'sequelize-typescript';
import { Nomination } from './nomination';
import { User } from './user';

@DefaultScope({
    include: [
        {
            model: () => Nomination,
        },
    ]
})
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
