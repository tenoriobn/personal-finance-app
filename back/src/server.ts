import { Hono } from "hono";
import { usersRoute } from "./routes/users";

const app = new Hono();

// rota teste
app.get("/", (c) => c.json({ message: "API rodando com Hono + Prisma + MongoDB Atlas 🚀" }));

// monta as rotas de users em /users
app.route("/users", usersRoute);

export default app;
