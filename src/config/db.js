import 'dotenv/config';
import ibmdb from 'ibm_db';

const connString = `DATABASE=${process.env.DB2_DATABASE};` +
    `HOSTNAME=${process.env.DB2_HOST};` +
    `PORT=${process.env.DB2_PORT || 50000};` +
    `PROTOCOL=TCPIP;` +
    `UID=${process.env.DB2_USER};` +
    `PWD=${process.env.DB2_PASSWORD};`;

export const query = async (sql, params = []) => {
    let conn;
    try {
        conn = await ibmdb.open(connString);
        return await conn.query(sql, params);
    } catch (err) {
        throw err;
    } finally {
        if (conn) await conn.close();
    }
};