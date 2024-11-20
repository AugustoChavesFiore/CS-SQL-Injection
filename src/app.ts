import express from "express";
import morgan from "morgan";
import cors from "cors";
import { Pool } from "pg";
import logger from "./logger";

const app = express();


//middlewares

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        const logMessage = `
            Request ID: ${Date.now() || 'N/A'}
            Method: ${req.method}
            URL: ${req.originalUrl}
            Route: ${req.route ? req.route.path : 'N/A'}
            IP: ${req.ip}
            Date: ${new Date()}
            User-Agent: ${req.get('User-Agent')}
            Content-Type: ${req.get('Content-Type')}
            Content-Length: ${req.get('Content-Length')}
            Authorization: ${req.get('Authorization')}
            Query Params: ${JSON.stringify(req.query)}
            Body Params: ${JSON.stringify(req.body)}
            Status: ${res.statusCode}
            Response Time: ${duration}ms
        `;
        logger.info(logMessage);
    });

    next();
});

const pgPool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'password',
    database: 'postgres',
    port: 5432
});

pgPool.connect((err, client, release) => {
    if (err) {
        console.error('Error connecting to PostgreSQL:', err.stack);
        return;
    }
    console.log('Connected to PostgreSQL');

    if (client) {
        const createTableQuery = `
            drop table if exists users;

            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50),
                password VARCHAR(50)
            );

            INSERT INTO users (username, password) VALUES ('admin', 'admin123');
        `;

        client.query(createTableQuery, (err, res) => {
            release();
            if (err) {
                console.error('Error creating table:', err.stack);
                return;
            }
            console.log('Table "users" is ready');
        });
    } else {
        release();
        console.error('Client is undefined');
    }
});



// Endpoint vulnerable a inyección SQL
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Construcción de consulta SQL insegura
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    console.log('Query ejecutada:', query);

    // Ejecución de la consulta
    pgPool.query(query, (err, result) => {
        if (err) {
            console.error('Error ejecutando la consulta:', err.stack);
            res.status(500).json('Error en el servidor.');
            return;
        }

        // Verificación de resultados
        if (result.rows.length > 0) {
            res.status(200).json('Login exitoso.');
        } else {
            res.status(401).json('Credenciales incorrectas.');
        }
    });
});

// Endpoint seguro contra inyección SQL

app.post('/login-secure', (req, res) => {
    const { username, password } = req.body;

    // Construcción de consulta SQL segura
    const query = 'SELECT * FROM users WHERE username = $1 AND password = $2';
    console.log('Query ejecutada:', query);

    // Ejecución de la consulta
    pgPool.query(query, [username, password], (err, result) => {
        if (err) {
            console.error('Error ejecutando la consulta:', err.stack);
            res.status(500).json('Error en el servidor.');
            return;
        }

        // Verificación de resultados
        if (result.rows.length > 0) {
            res.status(200).json('Login exitoso.');
        } else {
            res.status(401).json('Credenciales incorrectas.');
        }
    });
});




app.listen(3000, () => {
    console.log('Server on port 3000');
});