const DotEnv = require("dotenv").config().parsed;

export const ENVVariables = {
    AppPort: DotEnv.APPPORT,
    DbHost: DotEnv.DB_HOST,
    DbUsername: DotEnv.DB_USERNAME,
    DbPassword: DotEnv.DB_PASSWORD,
    DbPort: DotEnv.DB_PORT,
    Database: DotEnv.DATABASE,
    BcryptNum: DotEnv.BCRYPT_SALT_NUM,
    CryptrCode: DotEnv.CRYPT_CODE,
    JWTSecret: DotEnv.TOKENSECRET,
    JWTRefreshSecret: DotEnv.REFRESHTOKENSECRET,
}