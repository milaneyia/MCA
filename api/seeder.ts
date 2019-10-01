import { Sequelize } from 'sequelize-typescript';
import { Config } from '../Config';
import { Mode } from './models/Mode';
import { Category } from './models/Category';
import { SubCategory } from './models/SubCategory';
import { Beatmapset } from './models/Beatmapset';
import Axios from 'axios';
import { User } from './models/User';

const config = new Config;

const server = new Sequelize(config.database.name, config.database.username, config.database.password, {
    host: 'localhost',
    dialect: 'mariadb',
    models: [__dirname + '/models'],
});

server.sync({ force: true }).then(async () => {
    await Mode.bulkCreate([
        { name: 'Standard' },
        { name: 'Taiko' },
        { name: 'Fruits' },
        { name: 'Mania' },
        { name: 'Storyboard' },
    ]);

    await Category.bulkCreate([
        { name: 'beatmaps', modeId: 1 },
        { name: 'genre', modeId: 1 },
        { name: 'mappers', modeId: 1 },
        { name: 'beatmaps', modeId: 2 },
        { name: 'genre', modeId: 2 },
        { name: 'mappers', modeId: 2 },
        { name: 'beatmaps', modeId: 3 },
        { name: 'mappers', modeId: 3 },
        { name: 'beatmaps', modeId: 4 },
        { name: 'mappers', modeId: 4 },
        { name: 'beatmaps', modeId: 5 },
        { name: 'mappers', modeId: 5 },
    ])

    await SubCategory.bulkCreate([
        // std
        { name: 'Grand MCA Award', allowedNominations: 1, categoryId: 1 },
        { name: 'Marathon', allowedNominations: 3, categoryId: 1 },
        { name: 'Spread', allowedNominations: 3, categoryId: 1 },
        { name: 'Hitsounding', allowedNominations: 3, categoryId: 1 },
        { name: 'Unorthodox', allowedNominations: 3, categoryId: 1 },
        { name: 'Doujin', allowedNominations: 3, categoryId: 2 },
        { name: 'Anime', allowedNominations: 3, categoryId: 2 },
        { name: 'Electro', allowedNominations: 3, categoryId: 2 },
        { name: 'Western', allowedNominations: 3, categoryId: 2 },

        { name: 'Grand MCA Award', allowedNominations: 1, categoryId: 3 },
        { name: 'Mapper', allowedNominations: 3, categoryId: 3 },
        { name: 'Modder', allowedNominations: 3, categoryId: 3 },
        { name: 'Rookie', allowedNominations: 3, categoryId: 3 },
        { name: 'Influential', allowedNominations: 3, categoryId: 3 },

        //taiko
        { name: 'Grand MCA Award', allowedNominations: 1, categoryId: 4 },
        { name: 'Marathon', allowedNominations: 3, categoryId: 4 },
        { name: 'Spread', allowedNominations: 3, categoryId: 4 },
        { name: 'Hitsounding', allowedNominations: 3, categoryId: 4 },
        { name: 'Unorthodox', allowedNominations: 3, categoryId: 4 },
        { name: 'Doujin', allowedNominations: 3, categoryId: 5 },
        { name: 'Anime', allowedNominations: 3, categoryId: 5 },
        { name: 'Electro', allowedNominations: 3, categoryId: 5 },
        { name: 'Western', allowedNominations: 3, categoryId: 5 },

        { name: 'Grand MCA Award', allowedNominations: 1, categoryId: 6 },
        { name: 'Mapper', allowedNominations: 3, categoryId: 6 },
        { name: 'Modder', allowedNominations: 3, categoryId: 6 },
        { name: 'Rookie', allowedNominations: 3, categoryId: 6 },
        { name: 'Influential', allowedNominations: 3, categoryId: 6 },
    ]);

    let beatmapsets = (await Axios.get(`https://osu.ppy.sh/api/get_beatmaps?k=${config.osuApi.v1}&since=2019-01-01`)).data;
    let beatmapsetsSeed = [];
    let usersSeed = [];

    beatmapsets.forEach(b => {
        if (beatmapsetsSeed.find(bSeed => bSeed.id == b.beatmapset_id)) return;

        beatmapsetsSeed.push({
            id: b.beatmapset_id,
            artist: b.artist,
            title: b.title,
            creator: b.creator,
            creatorId: b.creator_id,
            source: b.source,
            tags: b.tags,
            genreId: b.genre_id,
            modeId: b.mode + 1 // to fit db ids
        });

        if (usersSeed.find(u => u.id == b.creator_id)) return;

        usersSeed.push({
            id: b.creator_id,
            username: b.creator,
        })
    });

    await Beatmapset.bulkCreate(beatmapsetsSeed);
    await User.bulkCreate(usersSeed);

}).catch((error) => console.log(error));
