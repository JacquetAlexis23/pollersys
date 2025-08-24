-- Enable Row Level Security on all business tables
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE production ENABLE ROW LEVEL SECURITY;
ALTER TABLE treasury ENABLE ROW LEVEL SECURITY;

-- Suppliers policies
CREATE POLICY "suppliers_select_own" ON suppliers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "suppliers_insert_own" ON suppliers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "suppliers_update_own" ON suppliers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "suppliers_delete_own" ON suppliers FOR DELETE USING (auth.uid() = user_id);

-- Clients policies
CREATE POLICY "clients_select_own" ON clients FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "clients_insert_own" ON clients FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "clients_update_own" ON clients FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "clients_delete_own" ON clients FOR DELETE USING (auth.uid() = user_id);

-- Products policies
CREATE POLICY "products_select_own" ON products FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "products_insert_own" ON products FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "products_update_own" ON products FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "products_delete_own" ON products FOR DELETE USING (auth.uid() = user_id);

-- Purchases policies
CREATE POLICY "purchases_select_own" ON purchases FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "purchases_insert_own" ON purchases FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "purchases_update_own" ON purchases FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "purchases_delete_own" ON purchases FOR DELETE USING (auth.uid() = user_id);

-- Sales policies
CREATE POLICY "sales_select_own" ON sales FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "sales_insert_own" ON sales FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "sales_update_own" ON sales FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "sales_delete_own" ON sales FOR DELETE USING (auth.uid() = user_id);

-- Stock policies
CREATE POLICY "stock_select_own" ON stock FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "stock_insert_own" ON stock FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "stock_update_own" ON stock FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "stock_delete_own" ON stock FOR DELETE USING (auth.uid() = user_id);

-- Production policies
CREATE POLICY "production_select_own" ON production FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "production_insert_own" ON production FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "production_update_own" ON production FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "production_delete_own" ON production FOR DELETE USING (auth.uid() = user_id);

-- Treasury policies
CREATE POLICY "treasury_select_own" ON treasury FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "treasury_insert_own" ON treasury FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "treasury_update_own" ON treasury FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "treasury_delete_own" ON treasury FOR DELETE USING (auth.uid() = user_id);
