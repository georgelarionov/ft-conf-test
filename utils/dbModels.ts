// utils/dbModels.ts

export interface FTProduct {
    _id: string;
    user_id: string;
    original_owner: string;
    title: string;
    description: string;
    product_type: string;
    price: number;
    purchased: boolean;
    updatedAt: string;
    createdAt: string;
    thumbnail: any;
    data: any;
    collections: ICollection[];
  }
  
  export interface ICollection {
    _id: string;
    user_id: string;
    type: string;
    name: string;
    description: string;
    products: FTProduct[];
    items: FTProduct[];
    items_limit: number;
    published: boolean;
    approved: boolean;
    createdAt: string;
    vendor: string;
  }
  
  export interface IUser {
    _id: string;
    email: string
    first_name: string;
    last_name: string;
    createdAt: string
  }

  export class Customer implements IUser {
    _id = '';
    email = '';
    first_name = '';
    last_name = '';
    createdAt = '';
  }

  export class Designer implements IUser {
    _id = '';
    email = '';
    login_email = '';
    first_name = '';
    last_name = '';
    createdAt = '';
    vendor = '';
  }

  export interface UserPrints {
    _id: string;
    owner: string;
    ownerModel: string;
    name: string;
    fileId: string;
    filename: string;
    contentType: string;
    // approved: boolean;
    status: string;
    denied_reason: string;
    createdAt: string;
  }
