"use strict";
import mysql from "mysql2/promise";

import connectionOptions from "./connection-options.js";

/**
 * Pool de conexões com o banco de dados
 * @type {mysql.Pool}
 */
const pool = mysql.createPool(connectionOptions);

/**
 * Executa uma query SQL no banco de dados
 * @async
 * @function execute
 * @param {string} command              Comando SQL a ser executado
 * @param {Array} [parameters=[]]       Parâmetros para a query
 * @returns {Promise<Array|undefined>}  Resultado da query ou undefined em caso de erro
 */
async function execute(command, parameters = []) {
    try {
        let [result] = await pool.execute(command, parameters);
        return result;
    } catch (error) {
        console.error('Database error:', error);
        return void 0;
    }
}

/**
 * Converte valor para número
 * @function number
 * @param {any} value           Valor a ser convertido
 * @returns {number|undefined}  Número convertido ou undefined se inválido
 */
function number(value) {
    let result = Number(value);
    return isNaN(result) ? void 0 : result;
}

/**
 * Converte valor para string
 * @function string
 * @param {any} value           Valor a ser convertido
 * @returns {string|undefined}  String convertida ou undefined se inválido
 */
function string(value) {
    return value === undefined ? void 0 : String(value);
}

/**
 * Converte valor para data no formato YYYY-MM-DD
 * @function date
 * @param {any} value           Valor a ser convertido
 * @returns {string|undefined}  Data formatada ou undefined se inválido
 */
function date(value) {
    let result = new Date(String(value));
    return isNaN(result.getTime()) ? void 0 : result.toISOString().slice(0, 10); // yyyy-mm-dd
}

/**
 * Converte valor para booleano numérico (1/0)
 * @function boolean
 * @param {any} value                       Valor a ser convertido
 * @param {boolean} [forceValue=false]      Forçar retorno booleano
 * @returns {number|undefined}              1, 0 ou undefined
 */
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

/**
 * Converte valor para booleano nativo
 * @function toBoolean
 * @param {any} value   Valor a ser convertido
 * @returns {boolean}   Booleano convertido
 */
function toBoolean(value) {
    return Boolean(value);
}

/**
 * Envia resposta de erro HTTP
 * @function sendError
 * @param {Object} response         Objeto de resposta HTTP
 * @param {string} [error=""]       Mensagem de erro
 * @param {number} [status=400]     Código de status HTTP
 */
function sendError(response, error = "", status = 400) {
    response.status(status).end(typeof error === "string" ? error : "");
}

/**
 * Envia resposta HTTP com resultado de query
 * @async
 * @function sendResponse
 * @param {Object} response         Objeto de resposta HTTP
 * @param {string} command          Comando SQL
 * @param {Array} parameters        Parâmetros da query
 * @param {Function} processResult  Função de processamento do resultado
 */
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
