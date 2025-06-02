customer_ids = Customer.all.pluck(:id) + [nil,nil]
30.times do |n|
  count = Product.all.count + 1
  Product.create(
    name:"Produk #{count}",
    customer_id: customer_ids.sample,
    description: "keterangan Produk #{count}",
    weight: SecureRandom.random_number(10).round,
    dimension_p: SecureRandom.random_number(10).round,
    dimension_l: SecureRandom.random_number(10).round,
    dimension_t: SecureRandom.random_number(10).round,
    product_type: Product.product_types.keys.sample,
    is_dangerous_goods: false
  )
end
