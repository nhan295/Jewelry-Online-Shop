require('dotenv').config(); // doc noi dung .env va them vao process.env
const {DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE} = process.env

module.exports = {
    client: 'pg',
    connection: {
        host: DB_HOST,  
        port: DB_PORT,
        user: DB_USERNAME,
        password: DB_PASSWORD,
        database: DB_DATABASE
    },
};