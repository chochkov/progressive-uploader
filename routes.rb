get '/' do  
  @pid = hash.concat((0...10).map{ ('a'..'z').to_a[rand(26)] }.join)
  @files_list = DB[:uploads].map(:title)
  @files_count = @files_list.length
  haml :index
end

post '/' do
  return unless params[:file] && (tmp = params[:file][:tempfile]) && (filename = params[:file][:filename])

  random_hash = hash

  path = File.join(config('dir'), random_hash)
  File.open(path, 'wb') do |file|
    while part = tmp.read(65536)
      file.write(part)
    end  
  end  

  upload_id = DB[:uploads].insert(:filename => filename, :title => filename, :hash => random_hash)
  session[:upload_id] = upload_id

  "<script language='javascript' type='text/javascript'>window.top.window.Upld.uploadComplete('"+upload_id.to_s+"');</script>"
end

get '/title/:id' do |id|
  DB[:uploads].filter(:id => id).get(:title)
end

post '/title' do
  return unless params[:title] && session[:upload_id]
  DB['UPDATE uploads SET title = ? WHERE id = ? ', params[:title], session[:upload_id]];
end

post '/upload-status' do
  puts params
end

not_found do
  redirect '/'
end