helpers do
  def config option
    'uploads/' if option == 'dir' 
  end
  def hash 
    h = Time.now.to_s.hash
    if h < 0 then 
      h = h.to_s
      h["-"] = 'A'
    end
    h.to_s
  end
end
