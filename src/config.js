require('dotenv').config();
const winston = require('winston');
const fs = require('fs');
const path = require('path');

// Setup PORT
const PORT = process.env.PORT || 3001

// Setup ENV
const environments = {
    DEV: Symbol('development'),
    TEST: Symbol('test'),
    STAGE: Symbol('stage'),
    PROD: Symbol('prod'),
};


const ENV_TEXT = process.env.ENV || 'development'; // Default to development if not set

let env_temp = environments.DEV;

if (ENV_TEXT === "test") {
    env_temp = environments.TEST;
} else if (ENV_TEXT === "stage") {
    env_temp = environments.STAGE;
} else if (ENV_TEXT === "prod") {
    env_temp = environments.PROD;
} 
const ENV = env_temp;

// Setup logging

const LOG_FILE = process.env.LOG_FILE;

const logger = winston.createLogger({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(({ timestamp, level, message }) => {
        return `${timestamp} [${level}]: ${message}`;
      })
    ),
    transports: LOG_FILE ? new winston.transports.File({ filename: LOG_FILE }) : [new winston.transports.Console()]
});

module.exports = {
    PORT,
    ENV,
    environments,
    logger
};
