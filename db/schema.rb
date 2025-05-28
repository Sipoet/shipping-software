# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.2].define(version: 2025_05_25_031556) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "clients", force: :cascade do |t|
    t.string "name", null: false
    t.string "type"
    t.text "address"
    t.string "bank"
    t.string "bank_account"
    t.string "bank_register_name"
    t.string "contact_number"
    t.string "tax_account"
    t.integer "default_port_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "container_types", force: :cascade do |t|
    t.string "name", null: false
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "containers", force: :cascade do |t|
    t.integer "container_type_id"
    t.string "container_number", null: false
    t.string "seal_number"
    t.integer "order_type", null: false
    t.integer "ship_schedule_id"
    t.integer "agent_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "packing_details", force: :cascade do |t|
    t.integer "packing_list_id", null: false
    t.integer "product_id"
    t.integer "quantity"
    t.decimal "total_weight", null: false
    t.string "weight_uom", null: false
    t.decimal "total_volume", null: false
    t.string "volume_uom", null: false
    t.decimal "send_cost", null: false
    t.text "description", null: false
    t.decimal "total_dimension_p"
    t.decimal "total_dimension_l"
    t.decimal "total_dimension_t"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "packing_lists", force: :cascade do |t|
    t.integer "container_id"
    t.string "code", null: false
    t.text "description"
    t.decimal "subtotal", default: "0.0", null: false
    t.decimal "grandtotal", default: "0.0", null: false
    t.decimal "tax_amount", default: "0.0", null: false
    t.decimal "total_item", null: false
    t.decimal "total_volume", default: "0.0", null: false
    t.string "volume_uom", default: "m3", null: false
    t.decimal "total_weight", default: "0.0", null: false
    t.string "weight_uom", default: "kg", null: false
    t.integer "sender_id", null: false
    t.integer "receiver_id", null: false
    t.date "transaction_date", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["code"], name: "index_packing_lists_on_code", unique: true
  end

  create_table "ports", force: :cascade do |t|
    t.string "name", null: false
    t.string "city", null: false
    t.string "country", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "products", force: :cascade do |t|
    t.string "name", null: false
    t.text "description"
    t.decimal "weight", default: "0.0", null: false
    t.decimal "dimension_p", default: "0.0", null: false
    t.decimal "dimension_l", default: "0.0", null: false
    t.decimal "dimension_t", default: "0.0", null: false
    t.integer "product_type", default: 0, null: false
    t.boolean "is_dangerous_goods", default: false, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "role_auths", force: :cascade do |t|
    t.integer "role_id", null: false
    t.string "auth_controller", null: false
    t.string "auth_action", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["role_id", "auth_controller", "auth_action"], name: "role_auth_idx"
  end

  create_table "roles", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "sales_invoice_details", force: :cascade do |t|
    t.integer "packing_list_id", null: false
    t.decimal "price"
    t.integer "row"
    t.text "description"
    t.decimal "quantity"
    t.string "unit_of_measurement"
    t.decimal "price_per_uom"
    t.integer "sales_invoice_id", null: false
    t.decimal "total", default: "0.0", null: false
    t.integer "detail_type", default: 0, null: false
    t.integer "product_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "sales_invoices", force: :cascade do |t|
    t.string "invoice_number"
    t.decimal "grand_total"
    t.integer "customer_id"
    t.datetime "invoice_at", null: false
    t.datetime "payment_due_at"
    t.datetime "paid_at"
    t.datetime "ship_departure_at"
    t.string "location"
    t.integer "status", default: 0, null: false
    t.integer "ship_schedule_id", null: false
    t.decimal "subtotal", default: "0.0"
    t.decimal "tax_amount", default: "0.0"
    t.float "tax_percentage"
    t.decimal "substract_amount", default: "0.0", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "settings", force: :cascade do |t|
    t.string "key_name", null: false
    t.jsonb "value", null: false
  end

  create_table "ship_schedules", force: :cascade do |t|
    t.integer "ship_id", null: false
    t.string "voyage", null: false
    t.datetime "estimated_arrived_sour_at", null: false
    t.datetime "estimated_departure_sour_at", null: false
    t.datetime "estimated_arrived_dest_at", null: false
    t.datetime "actual_arrived_sour_at"
    t.datetime "actual_departure_sour_at"
    t.datetime "actual_arrived_dest_at"
    t.string "booking_code", null: false
    t.integer "loading_port_id", null: false
    t.integer "destination_port_id", null: false
    t.integer "status", default: 0, null: false
    t.datetime "dorry_container_opened_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "ships", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "system_settings", force: :cascade do |t|
    t.string "keyname", null: false
    t.integer "user_id"
    t.jsonb "value", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["keyname", "user_id"], name: "sys_set_user_idx"
    t.index ["keyname"], name: "index_system_settings_on_keyname"
  end

  create_table "users", force: :cascade do |t|
    t.string "username", null: false
    t.boolean "is_active", default: false, null: false
    t.integer "role_id", null: false
    t.string "jti", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["jti"], name: "index_users_on_jti", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["username"], name: "index_users_on_username", unique: true
  end

  add_foreign_key "clients", "ports", column: "default_port_id"
  add_foreign_key "containers", "clients", column: "agent_id"
  add_foreign_key "containers", "container_types"
  add_foreign_key "containers", "ship_schedules"
  add_foreign_key "packing_details", "packing_lists"
  add_foreign_key "packing_details", "products"
  add_foreign_key "packing_lists", "clients", column: "receiver_id"
  add_foreign_key "packing_lists", "clients", column: "sender_id"
  add_foreign_key "packing_lists", "containers"
  add_foreign_key "role_auths", "roles"
  add_foreign_key "sales_invoice_details", "packing_lists"
  add_foreign_key "sales_invoice_details", "products"
  add_foreign_key "sales_invoice_details", "sales_invoices"
  add_foreign_key "ship_schedules", "ports", column: "destination_port_id"
  add_foreign_key "ship_schedules", "ports", column: "loading_port_id"
  add_foreign_key "ship_schedules", "ships"
  add_foreign_key "system_settings", "users"
  add_foreign_key "users", "roles"
end
