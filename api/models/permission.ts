import {Table, Column, Model, AllowNull, ForeignKey, DefaultScope, BelongsTo} from 'sequelize-typescript';
import { User } from './user';
import { Mode } from './mode';

@Table({
    timestamps: true,
})
export class Permission extends Model<Permission> {
    @AllowNull(false)
    @ForeignKey(() => User)
    @Column
    userId: number;

    @BelongsTo(() => User)
    user: User;
    
    @AllowNull(false)
    @ForeignKey(() => Mode)
    @Column
    modeId: number;

    @BelongsTo(() => Mode)
    mode: Mode;

    @AllowNull(false)
    @Column({
        defaultValue: false
    })
    canVote: boolean;

    @Column
    requestsAccess: boolean;

    @Column
    evidence: string;
}
