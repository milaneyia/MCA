import * as querystring from 'querystring';
import axios from 'axios';
import { Config } from '../Config';

const config = new Config();

export default class OsuApi {
    async getToken(code: string) {
        const postData = querystring.stringify({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: config.osuApi.redirect,
            client_id: config.osuApi.id,
            client_secret: config.osuApi.secret
        });

        const options = {
            method: 'post',
            url: 'https://osu.ppy.sh/oauth/token',
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: postData
        };

        try {
            const res = await axios(options);
            return res.data;
        } catch (error) {
            return { error: error };
        }
    }

    async refreshToken(refreshToken: string) {
        const postData = querystring.stringify({
            grant_type: 'refresh_token',
            client_id: config.osuApi.id,
            client_secret: config.osuApi.secret,
            refresh_token: refreshToken
        });

        const options = { 
            method: 'POST', 
            url: 'https://osu.ppy.sh/oauth/token',
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: postData
        };

        try {
            const res = await axios(options);
            return res.data;
        } catch (error) {
            return { error: error };
        }
    }

    async getUserInfo(token: string) {
        const options = { 
            method: 'GET',
            url: 'https://osu.ppy.sh/api/v2/me',
            headers: {
                Authorization: `Bearer ${token}`,
            }
        };

        try {
            const res = await axios(options);
            return res.data;
        } catch (error) {
            return { error: error };
        }
    }

    async setPermissions(userId: number) {
        try {
            let permissions = [];

            for (let mode = 0; mode < 4; mode++) {
                let bms = (await axios.get(`https://osu.ppy.sh/api/get_beatmaps?k=${config.osuApi.v1}&u=${userId}&m=${mode}`)).data;

                bms = bms.filter(b => {
                    let rankedAt = new Date(b.approved_date);
                    return b.approved == 1 && rankedAt >= new Date(2018, 1, 1) && rankedAt < new Date(2019, 1 ,1);
                });

                if (bms.length >= 1) {
                    permissions.push({
                        userId: userId,
                        modeId: mode + 1, // To fit modeId in DB
                        canVote: true,
                    });
                }
            }

            // can vote SB if has any ranked map
            if (permissions.length) {
                permissions.push({
                    userId: userId,
                    modeId: 5,
                    canVote: true,
                });

            }
            return permissions;
        } catch (error) {
            return [];
        }
    }

    async searchUser(user: string|number) {
        try {
            return (await axios.get(`https://osu.ppy.sh/api/get_user?k=${config.osuApi.v1}&u=${user}`)).data;
        } catch (error) {
            return { error: error };
        }
    }
}
