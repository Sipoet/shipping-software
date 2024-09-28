class CreateContainers < ActiveRecord::Migration[7.2]
  def change
    create_table :containers do |t|
      t.integer :container_type_id, null: false
      t.string :container_number, null: false
      t.string :seal_number
      t.integer :ship_id, null: false
      t.integer :ship_schedule_id, null: false
      t.integer :agent_id
      t.timestamps
    end

    add_foreign_key :containers, :ships
    add_foreign_key :containers, :ship_schedules
    add_foreign_key :containers, :clients, column: :agent_id
  end
end
