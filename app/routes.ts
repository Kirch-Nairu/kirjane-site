import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("./routes/home.tsx"),
  route("services", "./routes/services.tsx"),
  route("projects", "./routes/projects.tsx"),
  route("about", "./routes/about.tsx"),
  route("process", "./routes/process.tsx"),
  route("contact", "./routes/contact.tsx"),
] satisfies RouteConfig;
