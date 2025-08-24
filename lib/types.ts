export interface Supplier {
  id: string
  name: string
  contact_person?: string
  email?: string
  phone?: string
  address?: string
  user_id: string
  created_at: string
  updated_at: string
}

export interface Client {
  id: string
  name: string
  contact_person?: string
  email?: string
  phone?: string
  address?: string
  user_id: string
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  name: string
  description?: string
  category?: string
  unit_price: number
  supplier_id: string
  user_id: string
  created_at: string
  updated_at: string
}

export interface Purchase {
  id: string
  supplier_id: string
  product_id: string
  quantity: number
  unit_price: number
  total_amount: number
  purchase_date: string
  notes?: string
  user_id: string
  created_at: string
}

export interface Sale {
  id: string
  client_id: string
  product_id: string
  quantity: number
  unit_price: number
  total_amount: number
  sale_date: string
  notes?: string
  user_id: string
  created_at: string
}

export interface Stock {
  id: string
  product_id: string
  quantity: number
  min_stock: number
  max_stock: number
  location?: string
  user_id: string
  updated_at: string
}

export interface Production {
  id: string
  product_id: string
  quantity_produced: number
  production_date: string
  cost_per_unit: number
  total_cost: number
  notes?: string
  user_id: string
  created_at: string
}

export interface Treasury {
  id: string
  transaction_type: "income" | "expense"
  category: string
  amount: number
  description?: string
  transaction_date: string
  reference_type?: string
  reference_id?: string
  user_id: string
  created_at: string
}
