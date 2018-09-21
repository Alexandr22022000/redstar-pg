const pg = require('pg'),
    config = require('./config'),
    store = require('./store');

module.exports = (query, params) => {
    if (!store.pool) {
        store.pool = pg.Pool({connectionString: config.databaseUrl});
    }
    if (config.needLogs) console.log("Pool opened!");

    if (config.isLow) {
        setTimeout(() => {
            if (store.lastQuery > (new Date().getTime() - (config.timer - 10)) || !store.pool) return;

            store.pool.end();
            store.pool = null;

            if (config.needLogs) console.log("Pool closed!");
        }, config.timer);
    }

    store.lastQuery = new Date().getTime();
    return store.pool.query(query, params);
};