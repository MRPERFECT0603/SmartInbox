import postgres from 'postgres';

const connectionString = process.env.CONNECTION_STRING;
const sql = postgres(connectionString, { ssl: 'require' });

export default sql;