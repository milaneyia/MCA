import {Table, Column, Model, HasMany, AllowNull, PrimaryKey} from 'sequelize-typescript';

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
}
