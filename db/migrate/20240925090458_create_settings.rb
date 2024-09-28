class CreateSettings < ActiveRecord::Migration[7.2]
  def change
    create_table :settings do |t|
      t.string :key_name, null: false
      t.jsonb :value, null: false
    end
  end
end
