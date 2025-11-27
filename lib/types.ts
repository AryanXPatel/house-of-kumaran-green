export interface Product {
  id: string
  name: string
  slug: string
  description: string
  longDescription?: string
  price: number
  originalPrice?: number
  weight: string
  category: Category
  tags: string[]
  rating: number
  reviews: number
  image: string
  images?: string[]
  inStock: boolean
  isNew?: boolean
  isBestseller?: boolean
  ingredients?: string[]
  shelfLife?: string
  storageInfo?: string
}

export type Category =
  | "podis"
  | "pickles"
  | "sweets"
  | "savouries"
  | "vadams"
  | "ready-to-mix"
  | "vathals"
  | "seasonal"
  | "seer-bhakshanam"

export interface CategoryInfo {
  slug: Category
  name: string
  tamilName: string
  description: string
  image: string
  productCount: number
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Review {
  id: string
  productId: string
  userName: string
  rating: number
  comment: string
  date: string
  verified: boolean
}
