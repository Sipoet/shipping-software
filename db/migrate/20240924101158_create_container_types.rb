class CreateContainerTypes < ActiveRecord::Migration[7.2]
  def change
    create_table :container_types do |t|
      t.string :name, null: false
      t.decimal :weight, default: 0
      t.decimal :dimension_p, default: 0
      t.decimal :dimension_l, default: 0
      t.decimal :dimension_t, default: 0
      t.timestamps
    end
  end
end
