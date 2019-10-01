import { Table, Column, Model, ForeignKey, BelongsTo, DefaultScope } from 'sequelize-typescript';
import { Category } from './Category';

@DefaultScope({
    include: [
        {
            model: () => Category,
        },
    ]
})
@Table({
    timestamps: false,
})
export class SubCategory extends Model<SubCategory> {
    @Column
    name: string;

    @Column
    allowedNominations: number;

    @ForeignKey(() => Category)
    @Column
    categoryId: number;
    
    @BelongsTo(() => Category)
    category: Category;
}
