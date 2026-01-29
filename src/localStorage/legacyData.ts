export interface GeneralConfig {
  mTransNo: number;
  configKey: string;
  configValue: string;
  configDepartment: string;
  subscID: number;
}

export interface LogUser {
  mTransNo: number;
  userName: string;
  userId: string;
  pw: string;
  userType: string;
  designation: string;
  contactNo: string;
  emailId: string;
  imageFile: string;
  templateName: string;
  branch: string;
  linkNo: number;
  pwExpiry: number;
  badLogins: number;
  tokenNo: number;
  lastLogin: string;
  logoutDate: string | null;
  homePage: string;
  systemIP: string;
  lockCounter: number;
  lockStatus: string;
  createdBy: number;
  createdOn: string | null;
  modifiedBy: number;
  modifiedOn: string;
  subscID: number;
}

export interface MenuProduct {
  product: string;
  pslNo: number;
}

export interface MenuSection {
  section: string;
  sslNo: number;
}

export interface MenuModule {
  mTransNo: number;
  section: string;
  sslNo: number;
  moduleName: string;
  mslNo: number;
  modulePage: string;
  moduleIcon: string;
}

export const legacyData = {
  branch: "HO,J.WH,WVI,ZWH,WIS,W.KE,WSI,WSU",
  Branch: "HO,J.WH,WVI,ZWH,WIS,W.KE,WSI,WSU",

  Domain: "https://apiserver.leotech.africa",

  SubscID: 1,
  TokenNo: "hJXcOH1tPQE=",
  YearCode: 2026,

  GeneralConfigList: [
    {
      mTransNo: 4,
      configKey: "Countrycode",
      configValue: "255",
      configDepartment: "Generial",
      subscID: 1020,
    },
    {
      mTransNo: 10,
      configKey: "Distributor",
      configValue: "1",
      configDepartment: "Link",
      subscID: 1020,
    },
    {
      mTransNo: 3,
      configKey: "DomainName",
      configValue: "https://apiserver.leotech.africa",
      configDepartment: "Generial",
      subscID: 1020,
    },
    {
      mTransNo: 8,
      configKey: "StoreSalesTeam",
      configValue: "TSM,FSM,RL,FL",
      configDepartment: "Generial",
      subscID: 1020,
    },
    {
      mTransNo: 7,
      configKey: "StoreSalesTeam1",
      configValue: "FSM,RL,FL",
      configDepartment: "Generial",
      subscID: 1020,
    },
    {
      mTransNo: 5,
      configKey: "StoreSalesTeam2",
      configValue: "FSM,RL,FL",
      configDepartment: "Generial",
      subscID: 1020,
    },
    {
      mTransNo: 1,
      configKey: "TimeDefiance",
      configValue: "150",
      configDepartment: "General",
      subscID: 1020,
    },
    {
      mTransNo: 2,
      configKey: "TxnCurrency",
      configValue: "USD",
      configDepartment: "Generial",
      subscID: 1020,
    },
    {
      mTransNo: 9,
      configKey: "WarehouseSalesTeam",
      configValue: "ADMIN,RSM,TSM,TL,FL",
      configDepartment: "Generial",
      subscID: 1020,
    },
    {
      mTransNo: 6,
      configKey: "WarehouseSalesTeam1",
      configValue: "ADMIN,RSM,TL,FL",
      configDepartment: "Generial",
      subscID: 1020,
    },
  ] as GeneralConfig[],

  LogUser: {
    mTransNo: 2,
    userName: "Gangadhar",
    userId: "bis",
    pw: "bis@123456",
    userType: "ADMIN",
    designation: "",
    contactNo: "9343045121",
    emailId: "gangadhary@gmail.com",
    imageFile: "",
    templateName: "",
    branch: "HO,J.WH,WVI,ZWH,WIS,W.KE,WSI,WSU",
    linkNo: 0,
    pwExpiry: 0,
    badLogins: 0,
    tokenNo: 178872,
    lastLogin: "2026-01-29T13:34:24.587",
    logoutDate: null,
    homePage: "",
    systemIP: "1",
    lockCounter: 0,
    lockStatus: "Y",
    createdBy: 1,
    createdOn: null,
    modifiedBy: 2,
    modifiedOn: "2025-12-27T08:02:32.62",
    subscID: 1,
  } as LogUser,

  MenuProduct: [
    { product: "Inventory", pslNo: 1 },
    { product: "Accounts", pslNo: 2 },
    { product: "HR", pslNo: 4 },
    { product: "Task", pslNo: 5 },
  ] as MenuProduct[],

  MenuSection: [
    { section: "Home", sslNo: 1 },
    { section: "Dashboard", sslNo: 2 },
    { section: "Sales", sslNo: 3 },
    { section: "Inventory", sslNo: 4 },
    { section: "Utility", sslNo: 5 },
  ] as MenuSection[],

  MinuList: [
    {
      mTransNo: 1,
      section: "Home",
      sslNo: 1,
      moduleName: "Home",
      mslNo: 1,
      modulePage: "/Inventory/Home.html",
      moduleIcon: "",
    },
    {
      mTransNo: 2,
      section: "Dashboard",
      sslNo: 2,
      moduleName: "Dashboard",
      mslNo: 1,
      modulePage: "/Inventory/Dashboard.html",
      moduleIcon: "",
    },
    {
      mTransNo: 3,
      section: "Sales",
      sslNo: 3,
      moduleName: "Dealer Sales",
      mslNo: 1,
      modulePage: "/Inventory/Sales.html",
      moduleIcon: "bi bi-people",
    },
    {
      mTransNo: 8,
      section: "Sales",
      sslNo: 3,
      moduleName: "Sales Returns",
      mslNo: 6,
      modulePage: "/Inventory/CreditNote.html",
      moduleIcon: "bi bi-arrow-return-left",
    },
    {
      mTransNo: 9,
      section: "Sales",
      sslNo: 3,
      moduleName: "Sales Reports",
      mslNo: 7,
      modulePage: "/Inventory/SalesRegister.html",
      moduleIcon: "bi bi-file-bar-graph",
    },
    {
      mTransNo: 58,
      section: "Sales",
      sslNo: 3,
      moduleName: "Sales Analytics & Insights",
      mslNo: 10,
      modulePage: "/Inventory/SaleTeamReport.html",
      moduleIcon: "",
    },
    {
      mTransNo: 14,
      section: "Sales",
      sslNo: 3,
      moduleName: "Dealer Master",
      mslNo: 12,
      modulePage: "/Inventory/Dealers.html",
      moduleIcon: "bi bi-person-badge",
    },
    {
      mTransNo: 21,
      section: "Sales",
      sslNo: 3,
      moduleName: "Sales Price List",
      mslNo: 19,
      modulePage: "/Inventory/SalesPriceList.html",
      moduleIcon: "bi bi-tags",
    },
    {
      mTransNo: 22,
      section: "Sales",
      sslNo: 3,
      moduleName: "Sales Area",
      mslNo: 20,
      modulePage: "/Inventory/SalesArea.html",
      moduleIcon: "bi bi-geo-alt",
    },

    {
      mTransNo: 30,
      section: "Inventory",
      sslNo: 4,
      moduleName: "Direct Purchase",
      mslNo: 1,
      modulePage: "/Inventory/Purchase.html",
      moduleIcon: "bi bi-cart-plus",
    },
    {
      mTransNo: 61,
      section: "Inventory",
      sslNo: 4,
      moduleName: "Purchase Approval",
      mslNo: 2,
      modulePage: "/Inventory/PurchaseApproval.html",
      moduleIcon: "bi bi-check-circle",
    },
    {
      mTransNo: 32,
      section: "Inventory",
      sslNo: 4,
      moduleName: "Purchase Returns",
      mslNo: 3,
      modulePage: "/Inventory/DebitNote.html",
      moduleIcon: "bi bi-arrow-90deg-left",
    },
    {
      mTransNo: 33,
      section: "Inventory",
      sslNo: 4,
      moduleName: "Stock Transfer",
      mslNo: 4,
      modulePage: "/Inventory/StockTransfer.html",
      moduleIcon: "bi bi-arrow-left-right",
    },
    {
      mTransNo: 34,
      section: "Inventory",
      sslNo: 4,
      moduleName: "Stock Receipt",
      mslNo: 5,
      modulePage: "/Inventory/StockReceipt.html",
      moduleIcon: "bi bi-inbox",
    },
    {
      mTransNo: 36,
      section: "Inventory",
      sslNo: 4,
      moduleName: "Stock Audit",
      mslNo: 7,
      modulePage: "/Inventory/StockAudit.html",
      moduleIcon: "bi bi-clipboard-check",
    },
    {
      mTransNo: 37,
      section: "Inventory",
      sslNo: 4,
      moduleName: "Purchase Reports",
      mslNo: 8,
      modulePage: "/Inventory/PurchaseRegister.html",
      moduleIcon: "bi bi-file-earmark-bar-graph",
    },
    {
      mTransNo: 38,
      section: "Inventory",
      sslNo: 4,
      moduleName: "Stock Transfer Reports",
      mslNo: 9,
      modulePage: "/Inventory/StockTranferRegister.html",
      moduleIcon: "bi bi-arrow-left-right",
    },
    {
      mTransNo: 39,
      section: "Inventory",
      sslNo: 4,
      moduleName: "Stock Receipt Reports",
      mslNo: 10,
      modulePage: "/Inventory/StockReceiptRegister.html",
      moduleIcon: "bi bi-box-arrow-in-down",
    },
    {
      mTransNo: 40,
      section: "Inventory",
      sslNo: 4,
      moduleName: "Stock Statement",
      mslNo: 11,
      modulePage: "/Inventory/StockStatement.html",
      moduleIcon: "bi bi-file-text",
    },
    {
      mTransNo: 59,
      section: "Inventory",
      sslNo: 4,
      moduleName: "IMEI/Serial No History",
      mslNo: 11,
      modulePage: "/Inventory/IMEIHistory.html",
      moduleIcon: "bi bi-clock-history",
    },
    {
      mTransNo: 41,
      section: "Inventory",
      sslNo: 4,
      moduleName: "Item/ Model",
      mslNo: 12,
      modulePage: "/Inventory/ItemMaster.html",
      moduleIcon: "bi bi-box-seam",
    },
    {
      mTransNo: 42,
      section: "Inventory",
      sslNo: 4,
      moduleName: "Suppliers",
      mslNo: 13,
      modulePage: "/Inventory/SupplierMaster.html",
      moduleIcon: "bi bi-truck",
    },

    {
      mTransNo: 25,
      section: "Utility",
      sslNo: 5,
      moduleName: "Branch Master",
      mslNo: 1,
      modulePage: "/Inventory/BranchMaster.html",
      moduleIcon: "bi bi-diagram-3",
    },
    {
      mTransNo: 24,
      section: "Utility",
      sslNo: 5,
      moduleName: "Other Master",
      mslNo: 3,
      modulePage: "/Inventory/OtherMaster.html",
      moduleIcon: "bi bi-collection",
    },
    {
      mTransNo: 27,
      section: "Utility",
      sslNo: 5,
      moduleName: "User",
      mslNo: 4,
      modulePage: "/Inventory/UserMaster.html",
      moduleIcon: "bi bi-person",
    },
  ] as MenuModule[],
};
