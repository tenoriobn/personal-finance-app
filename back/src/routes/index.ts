import { budgetRoutes } from "src/modules/budgets/budget.route";
import { categoryRoutes } from "src/modules/category/category.route";
import { potRoutes } from "src/modules/pot/pot.route";
import { themeRoutes } from "src/modules/theme/theme.route";
import { transactionRoutes } from "src/modules/transaction/transaction.route";
import { userRoutes } from "src/modules/user/user.route";

export const routes = [
  { path: "/users", handler: userRoutes },
  { path: "/categories", handler: categoryRoutes },
  { path: "/themes", handler: themeRoutes },
  { path: "/pots", handler: potRoutes },
  { path: "/budgets", handler: budgetRoutes },
  { path: "/transactions", handler: transactionRoutes },
];