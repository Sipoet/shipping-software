class CreatePackingLists < ActiveRecord::Migration[7.2]
  def change
    create_table :packing_lists do |t|
      t.integer :container_id
      t.string :code, null: false
      t.text :description
      t.decimal :subtotal, null: false, default: 0
      t.decimal :grandtotal, null: false, default: 0
      t.decimal :tax_amount, null: false, default: 0
      t.decimal :total_item, null: false
      t.decimal :total_volume, null: false, default: 0
      t.string :volume_uom, null: false,default:'m3'
      t.decimal :total_weight, null: false, default: 0
      t.string :weight_uom, null: false,default:'kg'
      t.integer :sender_id, null: false
      t.integer :receiver_id, null: false
      t.date :transaction_date, null: false
      t.timestamps
    end

    add_index :packing_lists, :code, unique: true
    add_foreign_key :packing_lists, :containers
    add_foreign_key :packing_lists, :clients, column: :sender_id
    add_foreign_key :packing_lists, :clients, column: :receiver_id
  end
end
