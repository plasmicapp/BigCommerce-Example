
import { SiteTypes } from "@plasmicpkgs/commerce"
import { GetSiteInfoQuery } from '../schema'
export type BCCategory = NonNullable<
  GetSiteInfoQuery['site']['categoryTree']
>[0]
export type Category = SiteTypes.Category;

export type Brand = SiteTypes.Brand;

export type SiteTypes = SiteTypes.SiteTypes;

export type GetSiteInfoOperation = SiteTypes.GetSiteInfoOperation;

export type GetCategoriesHook = SiteTypes.GetCategoriesHook;

export type GetBrandsHook = SiteTypes.GetBrandsHook;