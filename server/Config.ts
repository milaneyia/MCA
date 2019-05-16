import * as fs from "fs";
import * as _ from "lodash";
import { Logger } from "./Logger";

export class Config {
    public http: {
        host: "",
        port: 0,
        publicUrl: "",
    };
    public session: {
        secret: "",
    };
    public sequelize: {
        uri: "",
    };
    public discord: {
        roles: {
            standard: "",
            mania: "",
            ctb: "",
            taiko: "",
            corsace: "",
            headStaff: "",
            eligible: "",
        },
        token: "",
        guild: "",
        clientId: "",
        clientSecret: "",
        invite: "",
        logChannel: "",
    };
    public registrationDeadline: Date;

    constructor(load: boolean = true) {
        if(load)
            this.load();
    }

    public load(configPath: string = "config.json") {
        this.parseConfig(fs.readFileSync(configPath).toString(), fs.readFileSync("config.defaults.json").toString());
    }

    private parseConfig(fileContent: string, defaultFileContent: string) {
        const fileContentJson = JSON.parse(fileContent);
        const defaultFileContentJson = JSON.parse(defaultFileContent);

        const configObj = _.defaultsDeep(fileContentJson, defaultFileContentJson);

        Object.entries(configObj).forEach(([key, value]) => {
            if(key === "registrationDeadline")
                return this.registrationDeadline = new Date(value as string);
            this[key] = value;
        });

        if(process.env.NODE_ENV === "production") {
            const envOptions: Array<{
                env: string;
                path: string;
                type: (val: string) => any;
            }> = [
                {
                    env: "SESSION_SECRET",
                    path: "session.secret",
                    type: String,
                },
                {
                    env: "DISCORD_TOKEN",
                    path: "discord.token",
                    type: String,
                },
                {
                    env: "DISCORD_CLIENTID",
                    path: "discord.clientId",
                    type: String,
                },
                {
                    env: "DISCORD_CLIENTSECRET",
                    path: "discord.clientSecret",
                    type: String,
                },
                {
                    env: "OSU_PASSWORD",
                    path: "osu.password",
                    type: String,
                },
                {
                    env: "OSU_APIKEY",
                    path: "osu.apiKey",
                    type: String,
                },
            ];

            for(const envOption of envOptions) {
                if(!process.env[envOption.env]) {
                    Logger.getLogger("config").error("Environment option " + envOption.env + " is needed for production deployment!");
                    process.exit(1);
                }
                const val = envOption.type(process.env[envOption.env]);
                if(!val) {
                    Logger.getLogger("config").error("Environment option " + envOption.env + " is of incorrect type!");
                    process.exit(1);
                }
                _.set(this, envOption.path, val);
            }
        }
    }
}