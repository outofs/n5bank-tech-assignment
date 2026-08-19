import { dedupeSelectValues } from "./select-options";

export type SellerAssetOptionSource = {
  category: string;
  assetType: string;
  licenseType: string | null;
};

export type SellerAssetSelectOptions = {
  categoryOptions: string[];
  assetTypeOptions: string[];
  licenseTypeOptions: string[];
};

function collectValues(
  assets: SellerAssetOptionSource[],
  key: keyof SellerAssetOptionSource,
) {
  return dedupeSelectValues(
    assets.map((asset) => {
      const value = asset[key];
      return typeof value === "string" ? value : "";
    }),
  );
}

export function buildSellerAssetSelectOptions(
  assets: SellerAssetOptionSource[],
): SellerAssetSelectOptions {
  return {
    categoryOptions: collectValues(assets, "category"),
    assetTypeOptions: collectValues(assets, "assetType"),
    licenseTypeOptions: collectValues(
      assets.filter((asset): asset is SellerAssetOptionSource & { licenseType: string } =>
        typeof asset.licenseType === "string" && asset.licenseType.length > 0,
      ),
      "licenseType",
    ),
  };
}
