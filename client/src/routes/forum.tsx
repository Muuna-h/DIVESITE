import { lazy } from "react";

const ForumPage = lazy(() => import("@/pages/forum"));
const CategoryTopicsPage = lazy(() => import("@/pages/forum/category"));

export const forumRoutes = [
  {
    path: "/forum",
    element: <ForumPage />,
  },
  {
    path: "/forum/categories/:categorySlug",
    element: <CategoryTopicsPage />,
  },
];
