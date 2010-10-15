require 'sequel'

DB = Sequel.sqlite('data/sqlite.db')

require 'data/schema.rb' unless DB.table_exists? :uploads