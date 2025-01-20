"use strict";
import mysql from "mysql2/promise";

import connectionOptions from "./connection-options.js";

async function execute(command, parameters = []) {
    let connection;
    try {
        connection = await mysql.createConnection(connectionOptions);
        let [result] = await connection.execute(command, parameters);
        return result;
        //result value is different depending on the SQL Command executed:
        //SELECT: [rows]
        //INSERT/UPDATE/DELETE: {affectedRows,changedRows,insertId,fieldCount,info,serverStatus,warningStatus}
    } catch (error) {
        return void 0;
    } finally {
        connection?.end();
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

export { execute, number, string, date, boolean, toBoolean, sendError, sendResponse };
