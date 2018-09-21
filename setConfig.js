const config = require('./config'),
    store = require('./store');

module.exports = (url, timer, isLow, needLogs) => {
    config.databaseUrl = url;

    if (timer !== undefined) config.timer = timer;
    if (isLow !== undefined) config.isLow = isLow;
    if (needLogs !== undefined) config.needLogs = needLogs;

    if (!config.isLow) {
        const loop = () => {
            setTimeout(loop, config.timer);

            if (store.lastQuery > (new Date().getTime() - (config.timer - 10)) || !store.pool) return;

            store.pool.end();
            store.pool = null;

            if (config.needLogs) console.log("Pool closed!!!");
        };

        loop();
    }
};