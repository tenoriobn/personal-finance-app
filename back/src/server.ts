import { Hono } from "hono";
import { budgetsRoute } from "./routes/budgets";

const app = new Hono();

// rota teste
app.get("/", (c) => c.json({ message: "API rodando com Hono + Prisma + MongoDB Atlas 🚀" }));

// monta as rotas de budgets em /budgets
app.route("/budgets", budgetsRoute);

export default app;
