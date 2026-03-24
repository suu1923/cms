import coreZhHans from "./core";
import legacyZhHans from "./legacy";
import sectionsZhHans from "./sections";
import contentTypesZhHans from "./contentTypes";

const zhHansTranslations: Record<string, string> = {
  ...coreZhHans,
  ...legacyZhHans,
  ...sectionsZhHans,
  ...contentTypesZhHans,
};

export default zhHansTranslations;
