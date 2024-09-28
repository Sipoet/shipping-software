class CreatePorts < ActiveRecord::Migration[7.2]
  def change
    create_table :ports do |t|
      t.string :name, null: false
      t.string :province, null: false
      t.string :country, null: false
      t.timestamps
    end
  end
end
