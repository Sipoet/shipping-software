class CreateShipSchedules < ActiveRecord::Migration[7.2]
  def change
    create_table :ship_schedules do |t|
      t.integer :ship_id, null: false
      t.string :voyage, null: false
      t.datetime :estimated_arrived_sour_at, null: false
      t.datetime :estimated_departure_sour_at, null: false
      t.datetime :actual_arrived_sour_at
      t.datetime :actual_departure_sour_at
      t.datetime :estimated_departure_dest_at, null: false
      t.datetime :actual_departure_dest_at
      t.string :booking_code, null: false
      t.integer :loading_port_id, null: false
      t.integer :destination_port_id, null: false
      t.integer :status, null: false, default: 0
      t.datetime :dorry_container_opened_at
      t.timestamps
    end

    add_foreign_key :ship_schedules, :ships
    add_foreign_key :ship_schedules, :ports, column: :loading_port_id
    add_foreign_key :ship_schedules, :ports, column: :destination_port_id
  end
end
