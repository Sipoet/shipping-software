class CreateSalesInvoices < ActiveRecord::Migration[7.2]
  def change
    create_table :sales_invoices do |t|
      t.string :invoice_number
      t.decimal :grand_total
      t.integer :customer_id
      t.datetime :invoice_at, null: false
      t.datetime :payment_due_at
      t.datetime :paid_at
      t.datetime :ship_departure_at
      t.string :location
      t.integer :status, null: false, default: 0
      t.integer :ship_schedule_id, null: false
      t.decimal :subtotal, default: 0
      t.decimal :tax_amount, default: 0
      t.float :tax_percentage
      t.decimal :substract_amount, default: 0, null: false
      t.timestamps
    end
  end
end
