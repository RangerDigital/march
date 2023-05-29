<p align="center">
  <br /><img
    width="600"
    src="logo.png"
    alt="Tasko – NestJS Task Management System"
  />
</p>

---

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

Tasko is a simple yet powerful Task Management system developed using **NestJS**.

This project aims to provide an easy way to manage tasks and their respective assignees. It includes a robust authentication system, and uses SQLite as the database backend.

> 🚧 Tasko is a minimalistic solution, suitable for personal projects and learning purposes!

<br>

## 🛠 Operating Principle

Tasko provides APIs to create, update, delete and fetch tasks. It also includes user management and authentication features.

The project uses TypeORM to interface with the SQLite database, and Passport.js for authentication (JWT strategy).

> 🚧 You are responsible for securing your own deployment!

<br>

## 🔥 Installation

Clone this repository to your local machine:

```bash
git clone https://github.com/yourusername/tasko.git
```

Install the required packages:

```bash
npm install
```

<br>

## 🎉 Usage

You should start by running the NestJS server:

```bash
npm run start
```

Then you can access the APIs at `localhost:3000`.

<br>

### User Management

You can register a new user by sending a POST request to `/auth/signup` with the following body:

```json
{
  "name": "username",
  "email": "email@example.com",
  "password": "yourpassword"
}
```

<br>

### Task Management

You can manage tasks by using the `/tasks` endpoint.

Authentication is required for these operations. You can get a JWT by sending a POST request to `/auth/signin`.

> 💡 Check out the `controllers` and `services` directories for more details about the endpoints!
