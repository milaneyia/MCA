import {Table, Column, Model, ForeignKey} from 'sequelize-typescript';
import { Mode } from './mode';

@Table({
    timestamps: false,
})
export class Category extends Model<Category> {
    @Column
    name: string;

    @Column
    allowedNominations: number;

    @Column
    isMaps: boolean;

    @Column
    isGenre: boolean;

    @Column
    isMappers: boolean;

    @Column
    isRookie: boolean;

    @ForeignKey(() => Mode)
    @Column
    modeId: number;
}
