interface Category {
  categoryName: string;
}
export const categories: Category[] = [
  { categoryName: 'Clothing' },
  { categoryName: 'Shoes' },
  { categoryName: 'Accessories' },
];

interface Image {
  title: string;
  url: string;
}
export interface SubCategories {
  categoryName: string;
  subcategoryNames: string[];
  images: Image[]
}
export interface SubContent {
  subcategoryNames: string[];
  images: Image[]
}
export const subcategories: SubCategories[] = [
  {
    categoryName: 'Clothing',
    subcategoryNames: [
      'Suits',
      'Tuxedos',
      'Blazers',
      'Dress Shirts',
      'Casual Shirts',
      'Polo Shirts',
      'Overshirts',
      'Waistcoats',
      'Knitwear',
      'Jeans',
      'Trousers',
      'Outerwear',
      'Sweatshirts and Joggers',
      'Polo T-Shirts',
      'Bermuda',
      'Underwear and Pajamas',
      'Swim Shorts',
    ],
    images: [
      { title: 'Polo', url: '../../assets/polo.jpg' },
      { title: 'Trousers', url: '../../assets/trousers.jpg' },
    ],
  },
  {
    categoryName: 'Accessories',
    subcategoryNames: [
      'Ties',
      'Pocket Squares',
      'Socks',
      'Belts',
      'Hats',
      'Bow Ties',
      'Cummerbunds',
      'Cufflinks',
      'Braces',
      'Rucksacks and Suitcases',
      'Sunglasses',
      'Small Leather Goods',
      'Beach Towels',
    ],
    images: [
      { title: 'Belts', url: '../../assets/belts.jpg' },
      { title: 'Hats', url: '../../assets/hats.jpg' },
    ],
  },
  {
    categoryName: 'Shoes',
    subcategoryNames: ['Sneakers', 'Loafers', 'Classic', 'Flip Flops'],
    images: [
      { title: 'Sneakers', url: '../../assets/sneakers.jpg' },
      { title: 'Loafers', url: '../../assets/loafers.jpg' },
    ],
  },
];
