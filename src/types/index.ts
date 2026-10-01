export type ModelKind =
  | "ball"
  | "bone"
  | "bag"
  | "bowl"
  | "bed"
  | "collar"
  | "mouse"
  | "tower"
  | "bottle"
  | "carrier"
  | "fishbowl"
  | "hutch";

export type Category = "Dog" | "Cat" | "Small Pet" | "Fish" | "Health";

export interface ProductModel {
  kind: ModelKind;
  color: string;
  accent: string;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: Category;
  rating: number;
  reviews: number;
  stock: number;
  badges: string[];
  features: string[];
  model: ProductModel;
  /** Optional path to a .glb/.gltf in /public/3d-models. Falls back to the procedural model. */
  modelUrl?: string;
  /** Optional product video (e.g. "/videos/bounce-pro-ball.mp4") shown on the product page. */
  videoUrl?: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  model: ProductModel;
}
