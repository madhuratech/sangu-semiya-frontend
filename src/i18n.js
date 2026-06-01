import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      productNotFound: "Product Not Found",
      backToProducts: "Back to Products",
      home: "Home",
      products: "Products",
      sanguQuality: "Sangu Quality",
      skuPrefix: "SKU: ",
      priceOnEnquiry: "Price on Enquiry",
      selectPackSize: "Select Pack Size",
      bulkEnquiry: "Bulk Enquiry",
      buyOnAmazon: "Buy on Amazon",
      lifestyleText: "Experience the gold standard of vermicelli excellence.",
      qualityPromise: "Quality Promise",
      pureWheatExcellence: "Pure Wheat Excellence",
      recommended: "Recommended",
      relatedVarieties: "Related Varieties",
      viewAllVarieties: "View All Varieties",
      nutritionGlance: "Nutrition at a Glance",
      defaultDescription: "Crafted with premium hard wheat semolina and refined wheat flour (maida) for the perfect texture. Delicious, traditional semiya your family deserves.",
      // Features
      featureWheatSemolina: "Premium Wheat Semolina",
      featureNoAdditives: "No Bleach, No Artificial Additives",
      featureQuickCook: "Cooks in Just 5–7 Minutes",
      featureTripleLayer: "Triple-Layer Fresh-Lock Packaging",
      // Nutrition labels
      nutrEnergy: "Energy",
      nutrProtein: "Protein",
      nutrCarbs: "Carbohydrates",
      nutrTotalFat: "Total Fat",
      nutrDietaryFiber: "Dietary Fiber",
      nutrSodium: "Sodium",
      // Promises
      promiseDurumWheatLabel: "Premium Wheat Blend",
      promiseDurumWheatDesc: "Only the finest hard wheat suji and high-grade ingredients for superior bite.",
      promiseNonStickyLabel: "Non-Sticky Guarantee",
      promiseNonStickyDesc: "Perfectly separated strands every single time you cook.",
      promiseFamilyTrustedLabel: "Family Trusted",
      promiseFamilyTrustedDesc: "Serving traditional South Indian households since 1982.",
      cookingInspirationFallback: "Pure Wheat. Perfect Texture. Every Time."
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
