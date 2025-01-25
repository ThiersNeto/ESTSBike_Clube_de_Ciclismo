
/**
 * Módulo de configuração do banco de dados
 * @module DatabaseConfig
 * @description Contém as credenciais e informações de conexão com o banco de dados MySQL
 * @property {string} host          Endereço do servidor de banco de dados
 * @property {string} user          Nome de usuário para autenticação
 * @property {string} password      Senha para autenticação
 * @property {string} database      Nome da base de dados a ser utilizado
 *
 * const connection = await mysql.createConnection(dbConfig);
 *
 * @warning
 * - Nunca comitar credenciais reais no controle de versão
 * - Utilizar variáveis de ambiente em produção
 */
export default {
    "mysqlOptions": {
      "authProtocol": "default",
      "enableSsl": "Disabled"
    },
    "previewLimit": 50,
    "server": "localhost",
    "port": 3307,
    "driver": "MySQL",
    "name": "sql",
    "database": "estsbike",
    "user": "root",
    "password": "admin"
  };
