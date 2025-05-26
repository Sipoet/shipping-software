Container.create!({
  container_number:'83423939',
  order_type: 0,
  agent_id: Agent.all.first.id,
})
Container.create!({
  container_number:'3184123',
  order_type: 1,
  agent_id: Agent.all.last.id,
})
