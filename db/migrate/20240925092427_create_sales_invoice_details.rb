class CreateSalesInvoiceDetails < ActiveRecord::Migration[7.2]
  def change
    create_table :sales_invoice_details do |t|
      t.integer :packing_list_id, null: false
      t.decimal :price
      t.integer :row
      t.text :description
      t.decimal :quantity
      t.string :unit_of_measurement
      t.decimal :price_per_uom
      t.integer :sales_invoice_id, null: false
      t.decimal :total, default: 0, null: false
      t.integer :detail_type, default: 0, null: false
      t.integer :product_id, null: false
      t.timestamps
    end

    add_foreign_key :sales_invoice_details, :products
    add_foreign_key :sales_invoice_details, :sales_invoices
    add_foreign_key :sales_invoice_details, :packing_lists
  end
end
