import * as winston from "winston";
import * as winstonDailyRotateFile from "winston-daily-rotate-file";

export abstract class Logger {
    public static loggerTransports = [
        new winston.transports.Console({ level: "silly", format: winston.format.simple() }),
        new winstonDailyRotateFile({
            dirname: "data/logs/",
            filename: "%DATE%.log",
            level: "info",
        }),
    ];

    public static getLogger(label?: string): winston.Logger {
        return winston.createLogger({
            format: winston.format.combine(
                winston.format.label({ label }),
                winston.format.timestamp(),
                winston.format.json(),
            ),
            transports: Logger.loggerTransports,
        });
    }
}