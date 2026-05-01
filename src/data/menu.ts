import type { MenuItem } from "../types";

export const menuItems: MenuItem[] = [
  // 주류 (Alcohol)
  {
    id: "alcohol-1",
    name: "카스 생맥주 500ml",
    nameEn: "Cass Draft Beer 500ml",
    price: 5000,
    category: "주류",
  },
  {
    id: "alcohol-2",
    name: "테라 생맥주 500ml",
    nameEn: "Terra Draft Beer 500ml",
    price: 5000,
    category: "주류",
  },
  {
    id: "alcohol-3",
    name: "참이슬 소주",
    nameEn: "Chamisul Soju",
    price: 5000,
    category: "주류",
  },
  {
    id: "alcohol-4",
    name: "처음처럼 소주",
    nameEn: "Cheoeum Cheoreom Soju",
    price: 5000,
    category: "주류",
  },
  {
    id: "alcohol-5",
    name: "카스 병맥주",
    nameEn: "Cass Bottled Beer",
    price: 4000,
    category: "주류",
  },

  // 안주 (Snacks/Side Dishes)
  {
    id: "snack-1",
    name: "감자튀김",
    nameEn: "French Fries",
    price: 12000,
    category: "안주",
  },
  {
    id: "snack-2",
    name: "치킨너겟",
    nameEn: "Chicken Nuggets",
    price: 13000,
    category: "안주",
  },
  {
    id: "snack-3",
    name: "모듬소시지",
    nameEn: "Assorted Sausages",
    price: 15000,
    category: "안주",
  },
  {
    id: "snack-4",
    name: "골뱅이무침",
    nameEn: "Spicy Moon Snail Salad",
    price: 18000,
    category: "안주",
  },
  {
    id: "snack-5",
    name: "오징어튀김",
    nameEn: "Fried Squid",
    price: 14000,
    category: "안주",
  },

  // 식사 (Meals)
  {
    id: "meal-1",
    name: "라면",
    nameEn: "Ramen",
    price: 5000,
    category: "식사",
  },
  {
    id: "meal-2",
    name: "볶음밥",
    nameEn: "Fried Rice",
    price: 8000,
    category: "식사",
  },
  {
    id: "meal-3",
    name: "떡볶이",
    nameEn: "Tteokbokki",
    price: 10000,
    category: "식사",
  },

  // 음료 (Non-Alcoholic)
  {
    id: "drink-1",
    name: "콜라",
    nameEn: "Cola",
    price: 2000,
    category: "음료",
  },
  {
    id: "drink-2",
    name: "사이다",
    nameEn: "Sprite",
    price: 2000,
    category: "음료",
  },
  {
    id: "drink-3",
    name: "물",
    nameEn: "Water",
    price: 1000,
    category: "음료",
  },
];
