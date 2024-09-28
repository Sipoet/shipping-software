class CreateRoleAuths < ActiveRecord::Migration[7.2]
  def change
    create_table :role_auths do |t|
      t.integer :role_id, null: false
      t.string :auth_controller, null: false
      t.string :auth_action, null: false
      t.timestamps
    end

    add_foreign_key :role_auths, :roles
    add_index :role_auths, [:role_id, :auth_controller, :auth_action],name: 'role_auth_idx'
  end
end
