class CreateClients < ActiveRecord::Migration[7.2]
  def change
    create_table :clients do |t|
      t.string :name, null: false
      t.text :address
      t.string :bank
      t.string :bank_account
      t.string :bank_register_name
      t.string :contact_number
      t.string :tax_account
      t.integer :default_port_id
      t.timestamps
    end

    add_foreign_key :clients, :ports, column: :default_port_id
  end
end
