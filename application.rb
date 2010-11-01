%w(sinatra haml sequel).each do |gem|
  require gem
end

set :server => %w[thin webrick], :environment => :development, :sessions => true

load('data/init.rb')
load('helpers.rb')
load('routes.rb')