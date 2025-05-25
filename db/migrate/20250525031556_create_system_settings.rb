class CreateSystemSettings < ActiveRecord::Migration[7.2]
  def change
    create_table :system_settings do |t|
      t.string :keyname, null: false, index: true
      t.integer :user_id
      t.jsonb :value, null: false
      t.timestamps
    end
    add_foreign_key :system_settings, :users,column: :user_id
    add_index :system_settings, [:keyname,:user_id], name: 'sys_set_user_idx'
  end
end
