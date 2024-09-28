class CreatePackingLists < ActiveRecord::Migration[7.2]
  def change
    create_table :packing_lists do |t|
      t.integer :container_id, null: false
      t.integer :product_id, null: false
      t.text :description
      t.decimal :quantity, null: false
      t.decimal :total_dimension_p, null: false, default: 0
      t.decimal :total_dimension_l, null: false, default: 0
      t.decimal :total_dimension_t, null: false, default: 0
      t.decimal :total_weight, null: false, default: 0
      t.integer :supplier_id
      t.integer :customer_id, null: false
      t.decimal :price
      t.string :unit_of_measurement
      t.timestamps
    end

    add_foreign_key :packing_lists, :containers
    add_foreign_key :packing_lists, :products
    add_foreign_key :packing_lists, :clients, column: :supplier_id
    add_foreign_key :packing_lists, :clients, column: :customer_id
  end
end
