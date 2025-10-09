import { budgetRoutes } from "src/modules/budgets/budget.route";
import { categoryRoutes } from "src/modules/category/category.route";
import { potRoutes } from "src/modules/pot/pot.route";
import { themeRoutes } from "src/modules/theme/theme.route";
import { transactionRoutes } from "src/modules/transaction/transaction.route";
import { userRoutes } from "src/modules/user/user.route";
import { authRoutes } from "../modules/auth/auth.routes";
import { authentication } from "../middleware/authentication";
import { Hono } from "hono";

export const routes = [
  { path: "/login", handler: authRoutes },
  { path: "/users", handler: userRoutes, protected: true },
  { path: "/categories", handler: categoryRoutes, protected: true },
  { path: "/themes", handler: themeRoutes, protected: true },
  { path: "/pots", handler: potRoutes, protected: true },
  { path: "/budgets", handler: budgetRoutes, protected: true },
  { path: "/transactions", handler: transactionRoutes, protected: true },
];

export function registerRoutes(app: Hono) {
  routes.forEach(({ path, handler, protected: isProtected }) => {
    const router = new Hono();

    if (isProtected) {
      router.use(authentication);
    }

    router.route("/", handler);

    app.route(path, router);
  });
}