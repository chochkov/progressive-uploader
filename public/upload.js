var interval;

Upld = {
	timeout : 1000,
	post_title_url : '/title',
	get_upld_status_url : '/progress',	

	// 1. Form submitted. Let's add the iframe and schedule the progress inquierer.
	uploadStart : function(form){
		document.getElementById('iframe_holder').innerHTML = "<iframe id='upld_target' name='upld_target' src='#'></iframe>"		
		interval = setTimeout("Upld.inquireProgress()", this.timeout);
		return true;
	},
	
	// 2. File up on server, JS snippet loaded in iframe. Let's collect and POST the current title.
	uploadComplete : function(upload_id){
		if(upload_id == '-1'){
			// returned by the exception handler of the post '/' route.
			document.getElementById('progress_percentage').innerHTML = "We are most likely talking about the server having run out of space.";
			clearTimeout(interval);
			return;
		}
		
		clearTimeout(interval);
		
		var title = document.getElementById('file_title').value;
		if(title == '' || title == null){
			return Upld.updateUploadsList(upload_id);
		}
		var params = "id="+upload_id+"&title="+title;
		
		http = this.ajaxPrepare(this.post_title_url, params, 'POST', null);
		http.onreadystatechange = function() {
			if(http.readyState == 4 && http.status == 200) {
				return Upld.updateUploadsList(upload_id);
			}
		}
		http.send(params);		
	},
	
	// 3. This is called after the file AND title have been submitted. It will update the DOM.
	updateUploadsList : function(id){
		// This call might be skipped in order to decrease traffic. Title might instead be taken from the DOM.
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
	
	// -- service methods :
	
	inquireProgress : function(){
		pid = document.getElementById('progress_id_value').value;
		http = this.ajaxPrepare(this.get_upld_status_url, 0, 'GET', pid);
		http.onreadystatechange = function() {
			if(http.readyState == 4 && http.status == 200) {
				progress = eval(http.responseText);
				if(progress.state == 'uploading'){
					var perc = Math.round((progress.received / progress.size) * 100);
					document.getElementById('progress_percentage').innerHTML = perc + "%";
					interval = setTimeout("Upld.inquireProgress()", this.timeout);
				}
				else if(progress.state == 'done'){
					clearTimeout(interval);
					document.getElementById('progress_percentage').innerHTML = "Done";					
				}
				else{
					clearTimeout(interval);
					document.getElementById('progress_percentage').innerHTML = "Oops, the error.";
				}
			}
		}
		http.send(null);
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