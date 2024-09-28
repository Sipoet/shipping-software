class CreateUsers < ActiveRecord::Migration[7.2]
  def change
    create_table :users do |t|
      t.string :username, null: false
      t.boolean :is_active, null: false, default: false
      t.integer :role_id, null: false
      t.timestamps
    end
    add_index :users,:username, unique: true

  end
end
