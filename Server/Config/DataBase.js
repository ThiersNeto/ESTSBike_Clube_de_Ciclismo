"use strict";
import mysql from "mysql2/promise";

import connectionOptions from "./connection-options.js";

const pool = mysql.createPool(connectionOptions);

async function execute(command, parameters = []) {
    try {
        let [result] = await pool.execute(command, parameters);
        return result;
    } catch (error) {
        console.error('Database error:', error);
        return void 0;
    }
}

function number(value) {
    let result = Number(value);
    return isNaN(result) ? void 0 : result;
}

function string(value) {
    return value === undefined ? void 0 : String(value);
}

function date(value) {
    let result = new Date(String(value));
    return isNaN(result.getTime()) ? void 0 : result.toISOString().slice(0, 10); // yyyy-mm-dd
}

function boolean(value, forceValue = false) {
    let result;
    if (typeof value === "boolean") {
        result = value;
    } else if (typeof value === "string") {
        value = value.toLowerCase();
        result = value === "true" || (value === "false" ? false : void 0);
    }
    return result === void 0 ? (forceValue ? false : void 0) : Number(result); // 1/0/undefined
}

function toBoolean(value) {
    return Boolean(value);
}

function sendError(response, error = "", status = 400) {
    response.status(status).end(typeof error === "string" ? error : "");
}

async function sendResponse(response, command, parameters, processResult) {
    let result = await execute(command, parameters);
    if (result) {
        response.json(processResult(result));
    } else {
        sendError(response, "", 500);
    }
}

export {
    execute,
    string,
    number,
    date,
    boolean,
    toBoolean,
    sendError,
    sendResponse
};
