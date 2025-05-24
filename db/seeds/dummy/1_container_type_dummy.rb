[
  {name: 'dry van container', weight:2.2,dimension_p:5.9,dimension_l:2.3,dimension_t:2.3},
  {name: 'High cube container', weight:4.06,dimension_p:12.03,dimension_l:2.3,dimension_t:2.3},
  {name: 'Open Top container', weight:2.2,dimension_p:5.9,dimension_l:2.3,dimension_t:2.3}
].each do |data|
  ContainerType.find_or_create_by!(data)
end
