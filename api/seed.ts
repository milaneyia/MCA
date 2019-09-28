import { Mode } from "~/api/models/mode";
import { Category } from "~/api/models/category";

export default async () => {
    const [modes, categories] = await Promise.all([
        Mode.findAll(),
        Category.findAll(),
    ]);

    if (!modes || !modes.length) {
        await Mode.bulkCreate([
            { name: 'Standard' },
            { name: 'Taiko' },
            { name: 'Fruits' },
            { name: 'Mania' },
            { name: 'Storyboard' },
        ]);
    }

    if (!categories || !categories.length) {
        await Category.bulkCreate([
            { name: 'Grand MCA Award', allowedNominations: 1, isMaps: 1, modeId: 1 },
            { name: 'Marathon', allowedNominations: 2, isMaps: 1, modeId: 1 },
            { name: 'Spread', allowedNominations: 2, isMaps: 1, modeId: 1 },
            { name: 'Hitsounding', allowedNominations: 2, isMaps: 1, modeId: 1 },
            { name: 'Unorthodox', allowedNominations: 2, isMaps: 1, modeId: 1 },
            { name: 'Doujin', allowedNominations: 2, isMaps: 1, modeId: 1, isGenre: 1 },
            { name: 'Anime', allowedNominations: 2, isMaps: 1, modeId: 1, isGenre: 1 },
            { name: 'Electro', allowedNominations: 2, isMaps: 1, modeId: 1, isGenre: 1 },
            { name: 'Western', allowedNominations: 2, isMaps: 1, modeId: 1, isGenre: 1 },
            { name: 'Grand MCA Award', allowedNominations: 1, isMappers: 1, modeId: 1 },
            { name: 'Mapper', allowedNominations: 2, isMappers: 1, modeId: 1 },
            { name: 'Modder', allowedNominations: 2, isMappers: 1, modeId: 1 },
            { name: 'Rookie', allowedNominations: 2, isMappers: 1, modeId: 1, isRookie: 1 },
            { name: 'Influential', allowedNominations: 2, isMappers: 1, modeId: 1 },

            { name: 'Grand MCA Award', allowedNominations: 1, isMaps: 1, modeId: 2 },
            { name: 'Grand MCA Award', allowedNominations: 1, isMappers: 1, modeId: 2 },
            { name: 'Grand MCA Award', allowedNominations: 1, isMaps: 1, modeId: 3 },
            { name: 'Grand MCA Award', allowedNominations: 1, isMappers: 1, modeId: 3 },
            { name: 'Grand MCA Award', allowedNominations: 1, isMaps: 1, modeId: 4 },
            { name: 'Grand MCA Award', allowedNominations: 1, isMappers: 1, modeId: 4 },
            { name: 'Grand MCA Award', allowedNominations: 1, isMaps: 1, modeId: 5 },
            { name: 'Grand MCA Award', allowedNominations: 1, isMappers: 1, modeId: 5 },
        ]);
    }
}
