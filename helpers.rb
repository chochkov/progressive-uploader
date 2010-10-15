helpers do
  def config option
    'uploads/' if option == 'dir' 
  end
  def hash 
    Time.now.to_s.hash.to_s
  end
end
