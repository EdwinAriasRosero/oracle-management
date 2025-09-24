const oracledb = require("oracledb");

async function executeQuery(connectionConfig, query) {
  let connection;

  try {
    connection = await oracledb.getConnection(connectionConfig);
    const result = await connection.execute(query);
    return result;
  } catch (err) {
    throw err;
  } finally {
    try {
      await connection?.close();
    } catch {}
  }
}

module.exports = { executeQuery };
