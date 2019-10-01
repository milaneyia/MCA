import { Table, Column, Model } from 'sequelize-typescript';

@Table({
    timestamps: false,
})
export class Mode extends Model<Mode> {
    @Column
    name: string;
}

export enum Modes {
    Standard = 1,
    Taiko = 2,
    Fruits = 3,
    Mania = 4,
    Storyboard = 5,
}