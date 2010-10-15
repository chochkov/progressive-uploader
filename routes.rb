get '/' do  
  @pid = hash.concat((0...10).map{ ('a'..'z').to_a[rand(26)] }.join)
  @files_list = DB[:uploads].map(:title)
  @files_count = @files_list.length
  haml :index
end

post '/' do
  return unless params[:file] && (tmp = params[:file][:tempfile]) && (filename = params[:file][:filename])

  random_hash = hash

  begin
    path = File.join(config('dir'), random_hash)
    File.open(path, 'wb') do |file|
      while part = tmp.read(65536)
        file.write(part)
      end  
    end
    upload_id = DB[:uploads].insert(:filename => filename, :title => filename, :hash => random_hash)
    session[:upload_id] = upload_id
  rescue
    upload_id = -1;  
  end
  
  "<script language='javascript' type='text/javascript'>window.top.window.Upld.uploadComplete('"+upload_id.to_s+"');</script>"
end

get '/title/:id' do |id|
  DB[:uploads].filter(:id => id).get(:title)
end

post '/title' do
  return unless params[:title] && session[:upload_id]
  DB['UPDATE uploads SET title = ? WHERE id = ? ', params[:title], session[:upload_id]];
end

# # SIMULATE apache upload progress mod response for testing purposes.
# get '/progress' do
#   "new Object({ 'state' : 'uploading', 'received' : 35587, 'size' : 716595, 'speed' : 35587 })"
# end

not_found do redirect '/' end