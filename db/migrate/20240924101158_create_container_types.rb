class CreateContainerTypes < ActiveRecord::Migration[7.2]
  def change
    create_table :container_types do |t|
      t.string :name, null: false
      t.text :description
      t.timestamps
    end
  end
end
