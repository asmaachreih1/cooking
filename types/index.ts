export type Cuisine = 'lebanese' | 'palestinian';
export type MealType = 'main' | 'appetizer' | 'dessert' | 'salad' | 'soup' | 'beverage';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Recipe {
  id: string;
  title: string;
  title_ar?: string;
  description: string;
  description_ar?: string;
  image: string;
  category: Cuisine | string;
  category_ar?: string;
  type: MealType | string;
  type_ar?: string;
  prepTime: string;
  cookTime: string;
  servings: number | string;
  difficulty: Difficulty | string;
  ingredients: string[];
  ingredients_ar?: string[];
  instructions: string[];
  instructions_ar?: string[];
  tips: string;
  tips_ar?: string;
  story: string;
  story_ar?: string;
  featured?: boolean;
  recipeOfWeek?: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  title_ar?: string;
  excerpt: string;
  excerpt_ar?: string;
  content: string;
  content_ar?: string;
  image: string;
  author: string;
  date: string;
  category: string;
  category_ar?: string;
  readTime: string;
  tags?: string[];
}

export interface NewsItem {
  id: string;
  title: string;
  title_ar?: string;
  excerpt: string;
  excerpt_ar?: string;
  date: string;
  image: string;
  category: string;
  category_ar?: string;
  content: string;
  content_ar?: string;
}

export interface UserRole {
  id: string;
  name: string;
  permissions: string[];
}

export interface UserAccount {
  uid: string;
  email: string;
  displayName: string;
  roleId: string;
  roleName?: string;
  createdAt?: any;
}

export interface UserSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'pending' | 'replied';
  createdAt: any;
}

export const PERMISSIONS = {
  ACCESS_DASHBOARD: 'access_dashboard',
  MANAGE_USERS: 'manage_users',
  MANAGE_ROLES: 'manage_roles',
  CREATE_RECIPE: 'create_recipe',
  EDIT_RECIPE: 'edit_recipe',
  DELETE_RECIPE: 'delete_recipe',
  CREATE_BLOG: 'create_blog',
  EDIT_BLOG: 'edit_blog',
  DELETE_BLOG: 'delete_blog',
  CREATE_NEWS: 'create_news',
  EDIT_NEWS: 'edit_news',
   DELETE_NEWS: 'delete_news',
  MANAGE_SUBMISSIONS: 'manage_submissions',
} as const;
