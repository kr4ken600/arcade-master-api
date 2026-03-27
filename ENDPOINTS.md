# 🗺️ Mapa de la API (Endpoints)

Esta API está dividida en tres módulos principales. Las rutas marcadas con **[🔒 Admin]** requieren un token JWT de un usuario con privilegios de administrador, mientras que las de **[🔑 Auth]** requieren cualquier token válido.

## 🕹️ Catálogo de Juegos (`/games`)

Módulo encargado de gestionar las máquinas disponibles en el Arcade.

| Método | Endpoint | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/games` | 🟢 Público | Devuelve la lista completa de juegos disponibles. |
| `GET` | `/games/:id` | 🟢 Público | Devuelve los detalles de un juego específico. |
| `POST` | `/games` | 🔒 Admin | Crea un nuevo título en el catálogo. |
| `PATCH` | `/games/:id` | 🔒 Admin | Modifica la información (ej. título, género, año) de un juego existente. |
| `DELETE` | `/games/:id` | 🔒 Admin | Elimina una máquina del catálogo. |
| `POST` | `/games/:id/image` | 🔒 Admin | Sube la imagen de portada a Cloudinary y vincula la URL al juego. |

## 🪙 Partidas y Puntuaciones (`/sessions`)

El corazón del sistema. Registra las monedas insertadas y los puntajes obtenidos.

| Método | Endpoint | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/sessions` | 🔑 Auth | Registra una nueva partida. El `userId` se extrae automáticamente del token. Si el puntaje rompe el récord histórico, detona el evento WebSocket. |
| `GET` | `/sessions` | 🟢 Público | Historial global de todas las partidas jugadas ordenadas por fecha. |
| `GET` | `/sessions/:id` | 🟢 Público | Detalles específicos de una partida (jugador, control usado, fecha). |
| `PATCH` | `/sessions/:id` | 🔑 Auth | Corrige datos de una sesión específica. |
| `DELETE` | `/sessions/:id` | 🔑 Auth | Elimina el registro de una partida. |

*Ejemplo de Payload para `POST /sessions`:*

```json
{
  "score": 99500,
  "controllerUsed": "Arcade Joystick ESP32",
  "gameId": 1
}
```

## 📈 Estadísticas (Leaderboards)

Consultas optimizadas en base de datos para mostrar en las pantallas principales.

| Método | Endpoint | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/sessions/game/:gameId/highscores` | 🟢 Público | Devuelve el codiciado Top 10 histórico de un juego en específico, incluyendo el nombre del campeón. |
| `GET` | `/sessions/stats/most-played` | 🟢 Público | Devuelve el Top 5 de las máquinas que más "monedas" (sesiones) han recaudado. |
| `GET` | `/sessions/stats/controllers` | 🟢 Público | Muestra qué tipo de mandos prefieren los jugadores (estadística de hardware). |

## ⚡ Eventos de Tiempo Real (WebSockets)

La API cuenta con un Gateway abierto en la ruta raíz para mantener a los clientes sincronizados.

* *Conexión*: `http://tu-servidor`
* *Evento que debes escuchar*: `newHighScore`
* *Comportamiento*: El servidor emitirá este evento automáticamente a todos los dispositivos conectados únicamente cuando una nueva sesión `(POST /sessions)` registre un `score` superior al máximo histórico de esa máquina en particular.
