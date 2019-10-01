import { Table, Column, Model, AllowNull, PrimaryKey, HasMany, DefaultScope } from 'sequelize-typescript';
import { Permission } from './Permission';

@DefaultScope({
    include: [
        {
            model: () => Permission,
        },
    ]
})
@Table({
    timestamps: true,
})
export class User extends Model<User> {
    @PrimaryKey
    @Column
    id: number;

    @AllowNull(false)
    @Column
    username: string;

    @AllowNull(false)
    @Column({
        defaultValue: false
    })
    isRookie: boolean;

    @Column
    isStaff: boolean;

    @HasMany(() => Permission)
    permissions: Permission[];

    canParticipateFor(modeId) {
        return this.permissions.find(p => p.modeId == modeId && p.canParticipate) ? true : false;
    }
}
