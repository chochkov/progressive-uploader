Upld = {
	timeout : 500,
	post_title_url : '/title',
	get_upld_status_url : '/upload-status',	

	uploadStart : function(form){
		document.getElementById('iframe_holder').innerHTML = "<iframe id='upld_target' name='upld_target' src='#'></iframe>"
		interval = setTimeout("Upld.inquireProgress()", this.timeout);
		return true;
	},
	
	uploadComplete : function(upload_id){
		clearTimeout(interval);
		
		var title = document.getElementById('file_title').value;
		if(title == '' || title == null){
			return Upld.updateUploadsList(upload_id);
		}
		var params = "id="+upload_id+"&title="+title;
		http = this.ajaxPrepare(this.post_title_url, params, 'POST', null);
		http.onreadystatechange = function() {
			if(http.readyState == 4 && http.status == 200) {
				clearTimeout(interval);
				return Upld.updateUploadsList(upload_id);
			}
			clearTimeout(interval);
		}
		http.send(params);		
	},
	
	updateUploadsList : function(id){
		http = this.ajaxPrepare(this.post_title_url+'/'+id, 0, 'GET', null);
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
	
	inquireProgress : function(){
		pid = document.getElementById('progress_id_value').value;
		http = this.ajaxPrepare(this.get_upld_status_url, 0, 'GET', pid);
		http.onreadystatechange = function() {
			if(http.readyState == 4 && http.status == 200) {
				percentage = http.responseText;
				p = document.getElementById('progress_percentage').innerHTML = percentage + "%";
			}
		}
		http.send(null);
		interval = setTimeout("Upld.inquireProgress()", this.timeout);
	},
	
	ajaxPrepare : function(url, params, method, pid_header){
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