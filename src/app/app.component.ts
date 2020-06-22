import { Component , OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import {map} from 'rxjs/operators';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
	title = 'Angular 6 Project - Search for Directory list or File Info';
	registerForm: FormGroup;
	radio_val;
    submitted = false;
	pattern_folder = "^(?:[\w]\:\/[a-zA-Z_0-9-.]+)|(\/[a-zA-Z_0-9-.]+)";
	pattern_file = "^(?:[\w]\:\/[a-zA-Z_0-9-]+)|(\/[a-zA-Z_0-9-]+)|\.(txt|gif|pdf|doc|docx|xls|xlsx|jar|exe|jpeg|jpg|pdf)$)";
	httpdata;
	reqfilePath="";
	reqfolderPath="";
	folder_list_html_fragment = '';
    demofilejson = '{"name":"README.html","size":"0.1552734375  kb","path":"C:\\Program Files\\Java\\jdk1.8.0_231\\README.html","type":"Execute","abspath":"C:\\Program Files\\Java\\jdk1.8.0_231\\README.html","parent":"C:\\Program Files\\Java\\jdk1.8.0_231"}';
	demofolderjson = '{"folders":[{"folderInfo":{"name":"Folder1","size":"0.0  kb","path":"C:\\Bhanu-Demo-Software\\softwares\\folderListTest\\Folder1","flag":1,"type":"folder"}},{"folders":[{"folderInfo":{"name":"folder2","size":"0.0  kb","path":"C:\\Bhanu-Demo-Software\\softwares\\folderListTest\\Folder1\\folder2","flag":1,"type":"folder"}},{"folders":[{"folderInfo":{"name":"folder3","size":"0.0  kb","path":"C:\\Bhanu-Demo-Software\\softwares\\folderListTest\\Folder1\\folder2\\folder3","flag":1,"type":"folder"}},{"files":[{"name":"pom.xml","size":"2.3447265625  kb","path":"C:\\Bhanu-Demo-Software\\softwares\\folderListTest\\Folder1\\folder2\\folder3\\pom.xml","flag":0,"type":"file"},{"name":"README - Copy.md","size":"0.1708984375  kb","path":"C:\\Bhanu-Demo-Software\\softwares\\folderListTest\\Folder1\\folder2\\folder3\\README - Copy.md","flag":0,"type":"file"},{"name":"README.md","size":"0.1708984375  kb","path":"C:\\Bhanu-Demo-Software\\softwares\\folderListTest\\Folder1\\folder2\\folder3\\README.md","flag":0,"type":"file"}]}],"files":[{"name":"pom.xml","size":"2.3447265625  kb","path":"C:\\Bhanu-Demo-Software\\softwares\\folderListTest\\Folder1\\folder2\\pom.xml","flag":0,"type":"file"},{"name":"README.md","size":"0.1708984375  kb","path":"C:\\Bhanu-Demo-Software\\softwares\\folderListTest\\Folder1\\folder2\\README.md","flag":0,"type":"file"}]}],"files":[{"name":"README.md","size":"0.1708984375  kb","path":"C:\\Bhanu-Demo-Software\\softwares\\folderListTest\\Folder1\\README.md","flag":0,"type":"file"}]}]}';
	fileName;
	fileType;
	fileSize;
	filePath;
	
    constructor(private formBuilder: FormBuilder , private http: HttpClient ) { }

    ngOnInit() {
		alert('ngOnInit 1!! :-)')
        this.registerForm = this.formBuilder.group({
            folder: ['', [Validators.required ,Validators.pattern(new RegExp(this.pattern_folder)) ]],
			gender: ['', [Validators.required ]]
        });		
		
		this.http.get("http://jsonplaceholder.typicode.com/users")
      .subscribe((data) => this.displaydata(data));

    } 

 // convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }

    onSubmit(data) {
		alert('Enter!! :-)')
        this.submitted = true;

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }

        alert('SUCCESS!! :-)');
		this.radio_val = data.gender;
		alert('radio:'+this.radio_val);
		alert('folder path:'+data.folder);
		
		if (data.gender === 'folder'){
			this.reqfolderPath = data.folder;
			alert('folder path:'+this.reqfolderPath);
			this.getFolder_HttpResponse(data);
		}
		if (data.gender === 'file'){
			this.reqfilePath = data.folder;
			alert('folder path:'+this.reqfilePath);
			this.getFile_HttpResponse(data);
		}
			
    }
	
	displaydata(data) {this.httpdata = data; alert(JSON.stringify(data));}
	
	 getFolder_HttpResponse(data){
	
		const headers = new HttpHeaders().set('Content-Type', 'application/json');	 
		headers.append('Accept','application/json');
		//let headers = new HttpHeaders();
		//headers = headers.append('Accept', 'application/json');
		//headers = headers.append('Content-Type', 'application/json');
		 alert('HTTP CLIENT Call SUCCESS Folder!! :-)');
		 alert("http://localhost:8080/api/v1/directorylist?folderPath=" + this.reqfolderPath);
		this.http.get('http://localhost:8080/api/v1/directorylist?folderPath='+ this.reqfolderPath,{headers:headers})
      .subscribe((data1) => this.displayfiledata(data1));
	  alert('END');
	  
	}
	getFile_HttpResponse(data){	
	const headers = new HttpHeaders().set('Content-Type', 'application/json');		
	headers.append('Accept','application/json');
	const params = new HttpParams().set("filePath",data.folder);
		 alert('HTTP CLIENT Call SUCCESS File!! :-)');
		 alert("http://localhost:8080/api/v1/fileinfo" + this.reqfilePath);
		this.http.get('http://localhost:8080/api/v1/fileinfo',{headers:headers, params:params}) 
      .subscribe((data1) => this.displayfolderdata(data1));
	  alert('END');
	  //Call the function to set the values to this.displaydata(data1)  set this.demofolderjson
	  this.get_folder_html_all();
	}
	//set the file json object values to attributes
	displayfiledata(data1)
	{
		this.fileName = data1.name;
		this.fileType = data1.type;
		this.fileSize = data1.size;
		this.filePath = data1.path;
	}
	
	displayfolderdata(data1)
	{
		this.demofolderjson = data1;//assign the recieved json containing the folder list
		
	}	
	//Generate the HTML fragment to display the folder list
	get_folder_html_all()
	{
		this.folder_list_html_fragment = '<ul id="myUL">' + this.get_folder_html_tree(this.demofolderjson);
		alert("function end:" +'<ul id="myUL">' + this.get_folder_html_tree(this.demofolderjson));			
	}
	//Generate the HTML tree view fragment to display the folder list
	get_folder_html_tree(jsonObj) 
	{
		let file_name,folder_name;
		alert("Entery into function html:"+this.folder_list_html_fragment);
		if(jsonObj.folders[0].folderInfo.name != null)
		{
			folder_name = jsonObj.folders[0].folderInfo.name;
			alert("Folder Name :" + jsonObj.folders[0].folderInfo.name);        
		}
		if (("folderInfo" in jsonObj.folders[0]))  
		{
			
			if(jsonObj.folders[0].folderInfo.name != null)
			{
				//alert("IN IF2 folderinfo.name");
				this.folder_list_html_fragment += '<li><span class="caret">'+folder_name+'</span>';
				//alert("folder html :" + html);
	 
				if ("files" in jsonObj.folders[1])// files element exists in array folders
				{
					//alert("IN to IF files");
					file_name = jsonObj.folders[1].files[0].name;
					//alert("file Name :" + jsonObj.folders[1].files[0].name);
				}
				if ("files" in jsonObj.folders[1] )
				{
					this.folder_list_html_fragment += '<ul class="nested">';
					for(let f of jsonObj.folders[1].files)
					{                
						alert("For Loop Files add :" + f.name);
						file_name = f.name;
						this.folder_list_html_fragment += '<li>'+f.name+'</li>';
						//alert("file html :" + html);
					}        
				}   
			}
				//alert("Entry IF recurssive");
			if ("folders" in jsonObj.folders[1])
			{
				this.get_folder_html_tree(jsonObj.folders[1]);
				this.folder_list_html_fragment += '</li>';
				//alert("recursive end folder html:" + html);
			}else{
				this.folder_list_html_fragment += '</li>';
			}
			
		this.folder_list_html_fragment += '</ul>'
		//alert("end of function:" + html);
		
		}
		
	return this.folder_list_html_fragment;
	
	}
	

}//end