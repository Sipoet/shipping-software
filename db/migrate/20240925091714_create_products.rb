class CreateProducts < ActiveRecord::Migration[7.2]
  def change
    create_table :products do |t|
      t.string :name, null: false
      t.text :description
      t.decimal :weight, null: false, default: 0
      t.decimal :dimension_p, null: false, default: 0
      t.decimal :dimension_l, null: false, default: 0
      t.decimal :dimension_t, null: false, default: 0
      t.integer :product_type, null: false, default: 0
      t.boolean :is_dangerous_goods, null: false, default: false
      t.timestamps
    end
  end
end
