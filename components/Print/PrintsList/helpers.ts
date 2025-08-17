
import { APIEndpoints } from "utils/common";

// MOCK
export const prints = [
  {
    id: "6",
    invert: false,
    image: '/prints/FT_LOGO_SingleLine_Black_1000px.png',
  },
  {
    id: "1",
    invert: true,
    image: '/prints/FT_LOGO_SingleLine_White_1000px.png',
  },
  {
    id: "2",
    invert: false,
    image: '/prints/FT_LOGO_Stacked_Black_1000px.png',
  },
  {
    id: "3",
    invert: true,
    image: '/prints/FT_LOGO_Stacked_White_1000px.png',
  },
  // Добавляем SVG принты для демонстрации
  {
    id: "7",
    invert: false,
    image: '/prints/demo_logo.svg',
    isSvg: true
  },
  {
    id: "8",
    invert: false,
    image: '/prints/star_icon.svg',
    isSvg: true
  }
];

export const adaptUserPrints = (userPrints: any[]) => {
  return userPrints.map((print) => ({
    id: print._id,
    image: `${APIEndpoints.Images}/${print._id}`,
  }));
};
