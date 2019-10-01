import * as querystring from 'querystring';
import axios from 'axios';
import { Config } from '../Config';
import { Modes } from './models/Mode';

const config = new Config();

export function generateAuthorizeLink(rawState: string): string {
    const hashedState = Buffer.from(rawState).toString('base64');
    
    return (
        `https://osu.ppy.sh/oauth/authorize?response_type=code&client_id=${
            config.osuApi.id
        }&redirect_uri=${encodeURIComponent(config.osuApi.redirect)}&scope=identify&state=${hashedState}`
    );
}

export async function getToken(code: string) {
    const data = querystring.stringify({
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
        data: data
    };

    try {
        const res = await axios(options);
        return res.data;
    } catch (error) {
        return { error: error };
    }
}

export async function refreshToken(refreshToken: string) {
    const data = querystring.stringify({
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
        data: data
    };

    try {
        const res = await axios(options);
        return res.data;
    } catch (error) {
        return { error: error };
    }
}

export async function getUserInfo(token: string) {
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

export async function setPermissions(userId: number) {
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
                    canParticipate: true,
                });
            }
        }

        // can vote SB if has any ranked map
        if (permissions.length) {
            permissions.push({
                userId: userId,
                modeId: Modes.Storyboard,
                canParticipate: true,
            });

        }
        return permissions;
    } catch (error) {
        return [];
    }
}

export async function searchUser(user: string|number) {
    try {
        return (await axios.get(`https://osu.ppy.sh/api/get_user?k=${config.osuApi.v1}&u=${user}`)).data;
    } catch (error) {
        return { error: error };
    }
}
