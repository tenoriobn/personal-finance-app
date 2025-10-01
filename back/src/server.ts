/* eslint-disable no-console */
import { Hono } from "hono";
import { errorHandler } from "./middleware/errorHandler";
import { userRoutes } from "./modules/user/user.route";
import { categoryRoutes } from "./modules/category/category.route";
import { themeRoutes } from "./modules/theme/theme.route";
import { potRoutes } from "./modules/pot/pot.route";
import { budgetRoutes } from "./modules/budgets/budget.route";
import { transactionRoutes } from "./modules/transaction/transaction.route";

const app = new Hono();

app.use("*", async (context, next) => {
  console.log(`[${context.req.method}] ${context.req.url}`);
  await next();
});

app.onError(errorHandler);

app.route("/users", userRoutes);
app.route("/categories", categoryRoutes);
app.route("/themes", themeRoutes);
app.route("/pots", potRoutes);
app.route("/budgets", budgetRoutes);
app.route("/transactions", transactionRoutes);

export default app;
