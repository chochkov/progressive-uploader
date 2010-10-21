helpers do
  def config option
    'uploads/' if option == 'dir' 
  end
  def random_string
    (0...10).map{ ('a'..'z').to_a[rand(26)] }.join.concat(Time.now.usec.to_s)
  end
end
