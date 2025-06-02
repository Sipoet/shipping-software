agent_ids = Agent.all.pluck(:id)
5.times do |n|
  Container.create!({
    container_number:SecureRandom.hex(10),
    order_type: 0,
    agent_id: agent_ids.sample,
  })

  Container.create!({
    container_number:SecureRandom.hex(10),
    order_type: 1,
    agent_id: agent_ids.sample,
  })
end
