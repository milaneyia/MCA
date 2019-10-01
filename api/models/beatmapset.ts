import { Table, Column, Model, PrimaryKey, ForeignKey } from 'sequelize-typescript';
import { Mode } from './Mode';

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
    source: string;
    @Column
    tags: string;
    @Column
    genreId: number;
    @Column
    genre: string;
    @Column
    isMarathon: boolean;
    @Column
    isSpread: boolean;

    // taiko stuff
    @Column
    isSvHeavy: boolean;
    @Column
    isTechHeavy: boolean;
    
    // mania stuff
    @Column
    isLN: boolean;
    @Column
    isSV: boolean;
    @Column
    isAntiMeta: boolean;

    // sb stuff
    @Column
    storyboarder: string;
    @Column
    storyboarderIds: string;
    @Column
    isTechnical: boolean;
    @Column
    isGameplay: boolean;
    @Column
    isMinimalist: boolean;
    @Column
    isNarrative: boolean;
    
    @ForeignKey(() => Mode)
    @Column
    modeId: Number;
}
