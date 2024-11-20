# Proyecto de Prueba de Inyección SQL

Este proyecto es una aplicación de ejemplo que demuestra cómo una aplicación puede ser vulnerable a inyección SQL y cómo mitigar dicha vulnerabilidad utilizando consultas parametrizadas.

## Requisitos

- Node.js
- Docker y Docker Compose (opcional para DB)

## Instalación

1. Clona el repositorio:
    ```sh
    git clone https://github.com/AugustoChavesFiore/CS-SQL-Injection.git
    cd CS-SQL-Injection
    ```

2. Instala las dependencias:
    ```sh
    npm install
    ```

3. Inicia los servicios de Docker:
    ```sh
    docker-compose up
    ```

## Ejecución

Para ejecutar la aplicación en modo desarrollo, utiliza el siguiente comando:
```sh
npm run dev
```


# Endpoints
## Endpoint Vulnerable a Inyección SQL
* URL: /login
* Método: POST

```json
{
    "username": "admin",
    "password": "admin123"
}
```

## Endpoint Seguro contra Inyección SQL
* URL: /login-secure
* Método: POST
### Descripción: Este endpoint utiliza consultas parametrizadas para prevenir inyección SQL.

Cuerpo de la Solicitud:

```json
{
    "username": "admin",
    "password": "admin123"
}
```

### Configuración de TypeScript
El archivo tsconfig.json está configurado para compilar el código TypeScript en la carpeta src y emitir los archivos JavaScript en la carpeta dist.

### Configuración de Docker
El archivo docker-compose.yaml configura dos servicios:

* db: Un contenedor de PostgreSQL.
* pgAdmin: Una interfaz web para administrar la base de datos PostgreSQL.

### Notas
Asegúrate de que Docker y Docker Compose estén instalados y en funcionamiento en tu máquina.
La configuración de la base de datos y las credenciales están definidas en el archivo docker-compose.yaml.