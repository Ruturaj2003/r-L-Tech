import { legacyData } from "./legacyData";

/* simple values */
export const getDomain = () => legacyData.Domain;
export const getSubscID = () => legacyData.SubscID;
export const getTokenNo = () => legacyData.TokenNo;
export const getYearCode = () => legacyData.YearCode;

/* branches */
export const getBranches = () =>
  legacyData.branch.split(",").map((b) => b.trim());

export const getUserBranches = () =>
  legacyData.LogUser.branch.split(",").map((b) => b.trim());

/* user */
export const getLogUser = () => legacyData.LogUser;
export const getUserType = () => legacyData.LogUser.userType;

/* config */
export const getConfigValue = (key: string): string | undefined =>
  legacyData.GeneralConfigList.find((c) => c.configKey === key)?.configValue;

export const getConfigArray = (key: string): string[] => {
  const val = getConfigValue(key);
  return val ? val.split(",").map((v) => v.trim()) : [];
};

/* menu */
export const getMenuProducts = () => legacyData.MenuProduct;
export const getMenuSections = () => legacyData.MenuSection;
export const getMenuModules = () => legacyData.MinuList;

export const getModulesBySection = (section: string) =>
  legacyData.MinuList.filter((m) => m.section === section);

export const getModuleByPage = (page: string) =>
  legacyData.MinuList.find((m) => m.modulePage === page);

// Usage
// import { getLogUser } from "@/legacy/legacySelectors";

// const user = getLogUser();
