10.times do |index|
  Product.find_or_create_by!(
    name:"Produk #{index + 1}",
    product_type: Product.product_types.keys.sample,
    weight: SecureRandom.random_number(10),
    dimension_p: SecureRandom.random_number(10),
    dimension_l: SecureRandom.random_number(10),
    dimension_t: SecureRandom.random_number(10),)
end
