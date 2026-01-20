// src/config/routeRegistry.ts

export type ProductCode = "inventory" | "accounts" | "hr" | "task";

export interface RouteConfig {
  mTransNo: number;
  product: ProductCode;
  path: string;
}

export const ROUTE_REGISTRY: RouteConfig[] = [
  // Inventory
  { mTransNo: 1, product: "inventory", path: "/inventory/home" },
  { mTransNo: 2, product: "inventory", path: "/inventory/dashboard" },
  { mTransNo: 3, product: "inventory", path: "/inventory/sales/dealer-sales" },
  { mTransNo: 8, product: "inventory", path: "/inventory/sales/returns" },
  {
    mTransNo: 24,
    product: "inventory",
    path: "/inventory/utility/other-master",
  },

  // Accounts
  { mTransNo: 46, product: "accounts", path: "/accounts/home" },
  { mTransNo: 47, product: "accounts", path: "/accounts/dashboard" },
  { mTransNo: 43, product: "accounts", path: "/accounts/masters/account" },

  // HR
  { mTransNo: 55, product: "hr", path: "/hr/home" },
  { mTransNo: 56, product: "hr", path: "/hr/dashboard" },
  { mTransNo: 84, product: "hr", path: "/hr/employees/master" },

  // Task
  { mTransNo: 98, product: "task", path: "/task/home" },
  { mTransNo: 99, product: "task", path: "/task/dashboard" },
  { mTransNo: 100, product: "task", path: "/task/transactions/new" },
];

export function getRouteByMenuId(mTransNo: number): RouteConfig | undefined {
  return ROUTE_REGISTRY.find((r) => r.mTransNo === mTransNo);
}

export function getRouteByPath(path: string): RouteConfig | undefined {
  return ROUTE_REGISTRY.find((r) => r.path === path);
}
