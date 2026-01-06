import { routes } from ".";
import { authentication } from "../middleware/authentication";
import { Hono } from "hono";

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