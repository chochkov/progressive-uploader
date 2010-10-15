Upld = {
	
	timeout : 1000,
	post_title_url : '/title',
	get_upld_status_url : '/upload-status',	

	uploadStart : function(form){
		document.getElementById('iframe_holder').innerHTML = "<iframe id='upld_target' name='upld_target' src='#'></iframe>"
		this.interval = setTimeout("Upld.inquire_progress()", this.timeout);
		return true;
	},
	
	uploadComplete : function(upload_id){
		clearTimeout(this.interval);
		
		var title = document.getElementById('file_title').value;
		if(title == '' || title == null){
			return Upld.updateUploadsList(upload_id);
		}
		var params = "id="+upload_id+"&title="+title;
		http = this.ajax_prepare(this.post_title_url, params, 'POST', null);
		http.onreadystatechange = function() {
			if(http.readyState == 4 && http.status == 200) {
				return Upld.updateUploadsList(upload_id);
			}
		}
		http.send(params);		
	},
	
	updateUploadsList : function(id){
		http = this.ajax_prepare(this.post_title_url+'/'+id, 0, 'GET', null);
		http.onreadystatechange = function(){
			if(http.readyState == 4 && http.status == 200){
				title = http.responseText;
				fl = document.getElementById('files_list_container').innerHTML;
				document.getElementById('files_list_container').innerHTML = fl + "<p class=''>"+title+"</p>";
				number = document.getElementById('files_total_count_span').innerHTML;
				document.getElementById('files_total_count_span').innerHTML = parseInt(number) + 1;
			}
		}
		http.send(null);
	},
	
	inquire_progress : function(){
			
		pid = ''; // GET THE PID HERE!
		http = this.ajax_prepare(this.get_upld_status_url, 0, 'GET', pid);
		http.onreadystatechange = function() {
			if(http.readyState == 4 && http.status == 200) {
				as = 'ss';
				// percentage = ..
				// succcess on get request
			}
		}
		http.send(params);
	
		p = document.getElementById('progress_percentage');
		p.innerHTML = percentage + "%";
		
		this.interval = setTimeout("Upld.inquire_progress()", this.timeout);
	},
	
	ajax_prepare : function(url, params, method, pid_header){
		var http = new XMLHttpRequest();
		
		http.open(method, url, true);
	
		if(pid_header){
			http.setRequestHeader("X-Progress-ID", pid_header);
		}
	
		http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		http.setRequestHeader("Content-length", params.length);
		http.setRequestHeader("Connection", "close");
	
		return http;
	}
}