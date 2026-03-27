<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://res.cloudinary.com/dq3szvi4l/image/upload/v1774638336/arcade_master_api_oeimqy.png" width="120" alt="Nest Logo" /></a>
</p>

# 🕹️ Arcade Master API

¡Bienvenido al motor trasero del salón de Arcade definitivo!

**Arcade Master API** es un backend robusto construido con **NestJS** diseñado para gestionar catálogos de juegos retro, registrar sesiones de juego desde tableros arcade custom, calcular estadísticas globales y transmitir la emoción de los nuevos récords (High Scores) en tiempo real a las aplicaciones cliente (Ionic/Angular).

## ✨ Características Principales (Nivel S)

* 🛡️ **Seguridad y Roles (RBAC):** Sistema de autenticación con JWT. Diferencia entre jugadores normales y Administradores (los únicos con la llave para modificar el catálogo de máquinas).
* 📊 **Estadísticas Avanzadas:** Uso de TypeORM QueryBuilder para calcular en base de datos los juegos más populares, el top 10 de récords y el uso de hardware (ej. Arcade Joysticks vs Gamepads).
* ☁️ **Almacenamiento en la Nube:** Integración nativa con Multer y **Cloudinary** para almacenar las marquesinas y portadas de los juegos de forma segura y sin saturar el servidor.
* ⚡ **Tiempo Real (WebSockets):** Integración con **Socket.io** para emitir eventos de *NUEVO RÉCORD* instantáneamente a todos los clientes conectados cuando un jugador rompe la marca histórica.
* 🧪 **Código Blindado:** 100% de cobertura en pruebas unitarias (Controladores, Servicios, Guards y Gateways) usando **Jest**.

## 🛠️ Stack Tecnológico

* **Framework:** [NestJS](https://nestjs.com/) (TypeScript)
* **Base de Datos:** MariaDB
* **ORM:** [TypeORM](https://typeorm.io/)
* **Archivos:** [Cloudinary](https://cloudinary.com/) API
* **WebSockets:** Socket.io
* **Testing:** Jest

## 🚀 Instalación y Despliegue Local

1. Clona este repositorio.
2. Instala las dependencias del proyecto:

   ```bash
   npm install
   ```

3. Crea un archivo .env en la raíz del proyecto basándote en la siguiente estructura:

    ```bash
    # Database
    DB_HOST=ADD_INFO
    DB_PORT=ADD_INFO
    DB_USERNAME=ADD_INFO
    DB_PASSWORD=ADD_INFO
    DB_DATABASE=ADD_INFO
    DB_SYNCHRONIZE=ADD_INFO

    # Proyect
    NODE_ENV=ADD_INFO #development|prod
    PORT=ADD_INFO

    # JWT Config
    JWT_SECRET

    # Cloudinary
    CLOUDINARY_CLOUD_NAME=ADD_INFO
    CLOUDINARY_API_KEY=ADD_INFO
    CLOUDINARY_API_SECRET=ADD_INFO

    # BetterStack
    SENTRY_DSN=ADD_INFO
    ```

4. Levanta el servidor en modo desarrollo:

    ```bash
    npm run start:dev
    ```

## Eventos WebSocket Disponibles

El servidor de WebSockets corre en el mismo puerto que la API HTTP. Puedes conectarte y escuchar los siguientes eventos:

* `newHighScore`: Se emite globalmente cuando una partida recién guardada supera el récord histórico de un juego.

* **Payload**: { message, score, gameId, controller }

## 🧪 Pruebas Unitarias

Este proyecto mantiene un estándar estricto de calidad. Para correr la suite de pruebas:

```bash
# Pruebas unitarias
npm run test

# Reporte de cobertura
npm run test:cov
```

## Endpoints

Para un desglose detallado de cada ruta, sus métodos HTTP, requisitos de autenticación y ejemplos de payload, consulta el archivo [ENDPOINTS.md](ENDPOINTS.md).

## 👾 Player 1 / Autor

Diseñado y desarrollado con ☕ y mucho código por [**Kr4ken600**](https://github.com/kr4ken600).<br>
*(Architect of the Arcade Master API)*

**"Insert Coin to Continue..."** 🪙
