/**
 * Identifies the owning product/module for a route.
 */
export type ProductCode = "inventory" | "accounts" | "hr" | "task";

/**
 * Defines a single application route mapping.
 *
 * @property mTransNo - Unique menu or transaction identifier used for routing.
 * @property product  - Product/module the route belongs to.
 * @property path     - Absolute application path.
 */
export interface RouteConfig {
  mTransNo: number;
  product: ProductCode;
  path: string;
}

/**
 * Central registry mapping menu transaction numbers to application routes.
 *
 * This registry acts as a single source of truth for:
 * - Menu-based navigation
 * - Permission-based routing
 * - Reverse lookup by path or transaction number
 */
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

/**
 * Retrieves a route configuration by menu transaction number.
 *
 * @param mTransNo - Menu or transaction identifier.
 * @returns Matching route configuration, or undefined if not found.
 */
export function getRouteByMenuId(mTransNo: number): RouteConfig | undefined {
  return ROUTE_REGISTRY.find((r) => r.mTransNo === mTransNo);
}

/**
 * Retrieves a route configuration by its path.
 *
 * @param path - Absolute application path.
 * @returns Matching route configuration, or undefined if not found.
 */
export function getRouteByPath(path: string): RouteConfig | undefined {
  return ROUTE_REGISTRY.find((r) => r.path === path);
}
