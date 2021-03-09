import winston from 'winston';

export const loggerCreator = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'combined.log'  })
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
    )
});
