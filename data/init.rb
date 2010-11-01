DB = Sequel.sqlite('data/sqlite.db')

load('data/schema.rb') unless DB.table_exists? :uploads