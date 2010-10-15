%w(rubygems sinatra haml data/init).each do |gem|
  require gem
end

set :environment, :development
enable :sessions

require 'helpers.rb'

load('routes.rb')