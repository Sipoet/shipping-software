date = Date.today.strftime('%m%Y')
customer_ids = Customer.all.pluck(:id)
PackingList.create!({
  code:"INV/#{date}/#{SecureRandom.random_number(9999)}",
  description:'dummy packing list',
  tax_amount: 12_000,
  transaction_date: Date.today,
  sender_id: customer_ids.sample,
  receiver_id: customer_ids.sample,
  volume_uom: 'm3',
  weight_uom: 'kg',
  packing_details_attributes:[
    {
      quantity: 1,
      description:'detail 1',
      total_weight: 12,
      weight_uom:'kg',
      total_volume: 7,
      volume_uom:'m3',
      send_cost: 50_000,
      total_dimension_p:1,
      total_dimension_l:1,
      total_dimension_t:7,
    },
    {
      product_id: Product.all.first.try(:id),
      quantity: 1,
      description:'detail 2',
      total_weight: 15,
      weight_uom:'kg',
      total_volume: 12,
      volume_uom:'m3',
      send_cost: 70_000,
      total_dimension_p:1,
      total_dimension_l:3,
      total_dimension_t:4,
    }
  ]
})
