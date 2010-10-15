DB.create_table :uploads do
 primary_key :id, :auto_increment => true 
 String :title, :default => ''
 String :filename
 String :hash
end
