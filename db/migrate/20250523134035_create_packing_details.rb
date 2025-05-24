class CreatePackingDetails < ActiveRecord::Migration[7.2]
  def change
    create_table :packing_details do |t|
      t.integer :packing_list_id, null: false
      t.integer :product_id
      t.integer :quantity
      t.decimal :total_weight, null: false
      t.string :weight_uom, null: false
      t.decimal :total_volume, null: false
      t.string :volume_uom, null: false
      t.decimal :send_cost, null: false
      t.text :description, null: false
      t.decimal :total_dimension_p
      t.decimal :total_dimension_l
      t.decimal :total_dimension_t
      t.timestamps
    end
    add_foreign_key :packing_details, :products
  end
end
