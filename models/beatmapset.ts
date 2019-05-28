import {Table, Column, Model, HasMany, AllowNull, PrimaryKey} from 'sequelize-typescript';

@Table({
    timestamps: false
})
export class Beatmapset extends Model<Beatmapset> {
    @PrimaryKey
    @Column
    id: number;
    @Column
    artist: string;
    @Column
    title: string;
    @Column
    creator: string;
    @Column
    creatorId: number;
    @Column
    bpm: number;
    @Column
    source: number;
    @Column
    tags: number;
    @Column
    genreId: number;
    @Column
    languageId: number;
    @Column
    favouriteCount: number;
    @Column
    playCount: number;
    @Column
    totalLength: number;
    @Column
    hitLength: number;
    @Column
    difficulties: number;
    @Column
    lowestSr: number;
    @Column
    combinedDrain: number;
    @Column
    storyboard: boolean;
    @Column
    marathon: boolean;
    @Column
    spread: boolean;
    @Column
    genre: number;
}
