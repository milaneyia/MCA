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
}
