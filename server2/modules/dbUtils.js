// ./modules/dbUtils.js

const mysql = require('mysql2/promise');

class DbUtils {
    constructor() {
        this.host = process.env.DB_HOST;
        this.port = process.env.DB_PORT;
        this.database = process.env.DB_NAME;
        
        // Admin user for INSERT/CREATE 
        this.adminConfig = {
            host: this.host,
            port: this.port,
            user: process.env.DB_ADMIN_USER,
            password: process.env.DB_ADMIN_PASSWORD,
            database: this.database,
            ssl: {
                rejectUnauthorized: false
            }
        };

        // Read-only user for SELECT queries
        this.readerConfig = {
            host: this.host,
            port: this.port,
            user: process.env.DB_READER_USER,
            password: process.env.DB_READER_PASSWORD,
            database: this.database,
            ssl: {
                rejectUnauthorized: false
            }
        };

        // Specific rows required
        this.defaultPatients = [
            "('Sara Brown', '1901-01-01')",
            "('John Smith', '1941-01-01')",
            "('Jack Ma', '1901-01-30')",
            "('Elon Musk', '1901-01-01')"
        ];
    }

    // Establishes a connection based on the privilege needed
    async getConnection(type) {
        if (type === 'admin') {
            return await mysql.createConnection(this.adminConfig);
        } else {
            return await mysql.createConnection(this.readerConfig);
        }
    }

    async insertDefaultData() {
        let connection;
        try {
            connection = await this.getConnection('admin');
            
            // Check if table exists, if not create it
            const createTableQuery = `
                CREATE TABLE IF NOT EXISTS patients (
                    patientid INT(11) AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(100),
                    dateOfBirth DATETIME
                ) ENGINE = InnoDB;
            `;
            await connection.execute(createTableQuery);

            // Insert the 4 specific rows
            const values = this.defaultPatients.join(',');
            const insertQuery = `INSERT INTO patients (name, dateOfBirth) VALUES ${values}`;
            
            await connection.execute(insertQuery);
            return { success: true, message: "Table checked/created and 4 rows inserted." };

        } catch (err) {
            console.error("Insert Error:", err);
            return { success: false, error: err.message };
        } finally {
            if (connection) await connection.end();
        }
    }

    async executeSelect(sql) {
        let connection;
        try {
            // Strictly use the reader account 
            connection = await this.getConnection('reader');
            
            // Basic SQL injection/validation check
            const upperSql = sql.trim().toUpperCase();
            if (!upperSql.startsWith('SELECT')) {
               throw new Error("Only SELECT queries are allowed.");
            }

            const [rows] = await connection.execute(sql);
            return { success: true, data: rows };

        } catch (err) {
            console.error("Query Error:", err);
            return { success: false, error: err.message };
        } finally {
            if (connection) await connection.end();
        }
    }
}

module.exports = DbUtils;