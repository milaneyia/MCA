import {Table, Column, Model} from 'sequelize-typescript';

@Table({
    timestamps: false,
})
export class Mode extends Model<Mode> {
    @Column
    name: string;
}
