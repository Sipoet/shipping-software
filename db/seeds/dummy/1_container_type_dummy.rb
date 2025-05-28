
[
  {name: '20Dry', description:'20 feet dry container'},
  {name: '40HC', description:'40 feet high cube container' },
  {name: '21Dry', description:'21 feet dry container' },
  {name: '20OD', description:'20 feet open top container' },
  {name: '40FT', description:'40 feet container' },
].each do |data|
  ContainerType.find_or_create_by!(data)
end
