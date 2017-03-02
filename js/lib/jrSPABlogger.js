/* NAMESPACE - ALL OF OUR BLOG RELATED SETUP OPTIONS AND TEMPLATING GO IN THIS FUNCTION*/
function jrSPABlogger(){

	/*Define our environmental variables*/
	var envVars = {
		rootFolder : "/categories/",
	}


//-----------------------------------------------
	//BEGIN TEMPLATES
	/*
		TEMPLATE GENERATOR

		- TEMPLATES -
		- Search for the template tags in our body document
		- Select the number of iterations based the actual DOM nodes
		and not the other prototype properties
		- Then get the first template's link
		- call the file in the templates folder with ajax
		- on success change the result to a string so jQuery can pass
		it to the replaceWith function correctly.
		- then on complete we subtract, then test our count.
		- if the count is still > 0, then we know we are finding
		template tags. Checking each time, allows loading multiple
		templates, that themselves may contain more template tags
		- we can load templates in templates in templates, etc...
		params: elToBuild - element we will build on. If no element is provided then we defaul to a template tag
			listToBuild - list of elements we will gather and build
		return: none
	*/
	function buildTemplates(elToBuild, listElToBuild){

		if(elToBuild === "" || elToBuild == null || elToBuild == undefined){
			ourNodeToBuildOn = $("template");//All lists on DOM
		} else {
			ourNodeToBuildOn = elToBuild;
		}

		var count = -1;
		ourNodeToBuildOn.each(function( index ){
			count++;
		});
		
		ourNodeToBuildOn.first().attr('link', function(){
			
			var templateLink = "/templates/" + $(this).attr('link');
			$.ajax({
				method: "GET",
				url: templateLink,
				context: this,
				success : function(result){
					var theHtml = result.toString();
					$(this).replaceWith(theHtml);
				},
				error : function(err){
					console.error("@ERROR Simple Blogger: \n Error Loading Template. \n Check <template link=''></template> tags - Make sure you are referencing a valid link and that the html file exists in the template directory. \n", err);
					alert("@ERROR Simple Blogger: \n Error Loading Template. \n Check <template link=''></template> tags - Make sure you are referencing a valid link and that the html file exists in the template directory. Check console for more information. \n", err);
					count = 0;
				},
				complete : function(info){
					if(count > 0){
						updateDOM();
						buildTemplates(elToBuild);
					} else {
						//Next build our static content at a folder location
						buildLists(listElToBuild);//Only after all templates are loaded
					}
				}
			});
		});
	};//End buildTemplates
	
	//Simply gets the template from our template folder. Use with deferred.
	function getTemplate(template){
		var templateLink = /templates/ + template;
		return $.ajax({
			method: "GET",
			url: templateLink,
			context: this
		});
	}

	//END TEMPLATES
//---------------------------------------



//---------------------------------------
	//***NOTE: this functionality is not yet used

	//BEGIN MEMORY MANAGEMENT
	/*
		LOCAL SESSION MANAGEMENT - localSession memory
		- This just takes care of our get/set
		- Use this to hold the list of posts from our root directory.
		- I don't have to rebuild the structure each page load
	*/
	function LocalSessionManagement(){
		return {
			setSessionStorage : function(posts){
				sessionStorage['posts'] = JSON.stringify(posts);
			},
			getSessionStorage : function(posts){
				var sessionObj = JSON.parse(sessionStorage.getItem(posts));
				return sessionObj;
			}
		}
	}
	
	//END MEMORY MANAGEMENT
//---------------------------------------
	



//---------------------------------------
	//BEGIN STATIC CONTENT
	/*
		Get Category Contents
		- Returns a promise that has a list of our posts 
		- categoryDOMList consists of the categories passed
		from the <list category=""> tag
		
		-See the buildLists() function for more information

		**TODO: you should be able to list multiple categories but it
		is not working yet
	*/
	function getCategoryContents(categoryDOMList){
		var deferreds = [];//Array of each ajax call for our categories
		$.each(categoryDOMList, function(index, cat){
		    deferreds.push(
		        //**Important - Do not use a success handler - don't want to trigger the deferred object
		        $.ajax({
		            method: "GET",
		            url: cat
		        })
		    );
		});
		
		// Can't pass a literal array, so use apply.
		return $.when.apply($, deferreds).then(
			function(){
			    //When all ajax calls above are finished then:
			    /*
			    Get our html out of our returned deferreds.
			    Arguments is a keyword as in arguments to 
			    the scope of this function (callback in our case)
			    */
			    results = [];
			    for(var arg in arguments){
			    	results.push(arguments[arg[0]]);
			    }


			    //assign the hrefs to our postDOMlist
				var postDOMList = [];

				for(var html in results){
			    	//Return the directory URL, and grab anchor tags from the HTML
					//Then push them to an array
		    		//Store them in here
		        	$(results[html]).find("a").attr("href", function (i, val) {
		        		
		        		//remove hrefs that don't apply to our blog
		        		if(val.indexOf('../') !== -1 || val.indexOf('node-ecstatic') !== -1){
		        			//do not add to our array
		        		} else {
		        			postDOMList.push(val);
		        		}
		        	});
		        }

		        //Get rid of spaces and replace with dash
		        for(var i in postDOMList){
		        	//var newUrl = postDOMList[i].replace(/%20/g, "-");
		        	
		        	if(postDOMList[i].search('%20') != -1){
		        		alert("@ERROR - Simple Blog - use dashes instead of spaces in your post names. And all lower case.")
		        	}

		        }

		        return postDOMList;

		})
	};//End function
				    	

	//get our post data from our file and return the results
	function getPostData(postDOMList){
		var deferreds = [];//Array of each ajax call for our categories
		$.each(postDOMList, function(index, cat){
			deferreds.push(
		        // **Important - again no success handler - don't want to trigger the deferred object
		        $.ajax({
		            method: "GET",
		            url: cat + "index.md"

		        })
		    );
		});
		return $.when.apply($, deferreds).then(function(){
		    results = [];
		    if(postDOMList.length > 1){
			    for(var arg in arguments){
			    	results.push(arguments[arg[0]][0]);
			    }
			} else {
				results.push(arguments[0]);
			}		    
		    return results;
		});
	};

    //next we parse the data using the showdown library 
	function parseMd(data){

		var postContainer = [];
		for(var post in data){

			var textFile = data[post].split("---");

			//Build metadata object from our file
			var metadataArray = textFile[0].split('\n');
			
			//Remove any empty strings
			for(var i = 0; i <= metadataArray.length; i++){
				if(metadataArray[i] == "" || metadataArray[i] == null || metadataArray == undefined){
					metadataArray.splice(i,1);
				}
			}

			var newObj = {};
			for(var j = 0; j <= metadataArray.length-1; j++){

				//Split metadata
				var metaKeyValue = metadataArray[j].split(/:/);//.split(":");
				
				//Get rid of any spaces at the front and end
				metaKeyValue[0] = metaKeyValue[0].replace(/^\s\s*/, '').replace(/\s\s*$/, '');
				metaKeyValue[1] = metaKeyValue[1].replace(/^\s\s*/, '').replace(/\s\s*$/, '');
				//Metadata is ready

				newObj[metaKeyValue[0]] = metaKeyValue[1];
				
			}
			//Get content
			//Now handle our Markdown which is the 2nd part of our textFile
			var converter = new Showdown.converter();
			var content = converter.makeHtml(textFile[1]);

			newObj['content'] = content;

			postContainer.push(newObj);

		}//End for post in data
		return postContainer;
	};//End parseMd



	/*
		<list category="events" limit="5" page="true"></list>
		- category or folder of posts/items
			- left blank and it will show all of them
		- limit - number of posts to show (default 5)
			- number on each page is based off limit
			params: elToBuild - passed from our buildTemplates function
	*/
	function buildLists(elToBuild){

		//Check to see if we are to build all the lists on the DOM
		//or just the list element we pass.
		if(elToBuild === "" || elToBuild == null || elToBuild == undefined){
			ourNodeToBuildOn = $("list");//All lists on DOM
		} else {
			ourNodeToBuildOn = elToBuild;
		}


		ourNodeToBuildOn.empty();//Clear our the node(s)
		ourNodeToBuildOn.each(function( index ){
			var parentEl = $(this);
			var category = parentEl.attr('category');
			var limit = parentEl.attr('limit');
			//var paged = parentEl.attr('paged');
			var template = parentEl.attr('template');
			
			var catArray = [];
			var subArray = category.split(",");
			for(var cat in subArray){
				catArray.push(envVars.rootFolder + subArray[cat] + "/");
			}

			$.when( 
				getCategoryContents( catArray ),
				getTemplate( template )
			).then(function( ) {
				
				results = [];
				for(var arg in arguments){
				   	results.push(arguments[arg]);
				}
				var myTemplate = results[1][0].toString();//Make sure we have a string to avoid frag errors
				var myPostUrls = results[0];

				//Get our post data from the returned strings
			    getPostData( myPostUrls ).then(function( data ){
			    	var postContainer = parseMd(data);//returns data array of posts

			    	if(postContainer.length < limit){
			    		var numToShow = postContainer.length-1;
			    	} else {
			    		var numToShow = limit-1
			    	}

					for( var i = 0; i <= numToShow; i ++){
						
						if(postContainer[i] === undefined){
							//Do nothing
						} else {
							
							//Setup our baseUrl
							postContainer[i]['baseUrl'] = myPostUrls[i];
							
							//Adjust our images to point to the correct location
							for( var key in postContainer[i]){
								
								if(key === 'image' ){
									var imgHolder = postContainer[i][key];
									postContainer[i][key] = myPostUrls[i] + imgHolder;
								}
							}

							//clean up our 
							var completeTemplate = interpolate(myTemplate)(postContainer[i]);
							$(completeTemplate).appendTo(parentEl);
							updateDOM();
						}
					}
			    });
			},
			function( err ) {
				console.error( "@ERROR - unable to build list. Please Check Category name.", err );
				alert( "@ERROR - unable to build list. Please Check Category name.", err );
			});
		});	
	};//End buildLists


	//Grab the current post
	function getPost(postUrl){

		var template = $('post').attr('template');

		$.when(
		 	getPostData([postUrl]),//must pass an array to deferred(so we don't have to setup 2 different functions to do the same thing for multiple posts)
			getTemplate(template)
		).then(function(results){
			
			var myTemplate = arguments[1][0].toString();//Make sure we have a string to avoid frag errors
			var myPostData = arguments[0][0];
			var postContainer = parseMd([myPostData]);//must pass array
			var completeTemplate = interpolate(myTemplate)(postContainer[0]);
			
			$('post').empty();//clear all child nodes from post element
			$(completeTemplate).appendTo($('post'));
			updateDOM();
			$('#post').fadeIn('slow');//#post here is for our css and fade control

			window.location.hash = postUrl;//And lastly change our url
		});

	};

	//Grab the current archive category and display the posts
	function getArchive(postUrl){


		var template = $('archive').attr('template');
		var limit = $('archive').attr('limit');//default limit
		var catName = postUrl.split("/");

		$.when( 
				getTemplate( template )
		).then(function(results) {
			var theHtml = results.toString();//Get the html and toString to avoid frag errors
			var archiveEl = $('archive');
			archiveEl.empty();//Clear our node,
			archiveEl.append(theHtml);//Append it to our dom element
			
			$('archive list').attr('category', catName[2]); //Change the archive <list category=""> attribute
			buildTemplates($('archive template'), $('archive list'));//This will build any templates and then the lists
			
			$('#archive').fadeIn('slow');
			window.location.hash = postUrl;//And lastly change our url

		});
		

	};



	/*-----------------------------------
		Helper Functions
	-------------------------------------*/
	//To replace brackets with string
	//http://stackoverflow.com/questions/15502629/regex-for-mustache-style-double-braces/15502875
	/*
		- recursive 
		- pass the string like:
			myString = "<h1>{title}</h1>";
			myObject = {title: 'Hello World'};
			var returnedString = interpolate(myString)(myObject)
	*/
	function interpolate(str) {
	    return function interpolate(o) {
	        return str.replace(/{([^{}]*)}/g, function (a, b) {
	            var r = o[b];
	            return typeof r === 'string' || typeof r === 'number' ? r : a;
	        });
	    }
	}


	


	/*----------------------------------
	Direct User DOM Manipulation
	- Once we load all templates and lists
	we will call this.
	- The purpose is to handle the default interactions with our DOM.
	- We remove all the click event listeners and then reattach our own 
	to aquire the functionality we need.
	-------------------------------------*/
	function updateDOM(){

		$('a').unbind('click'); //clear all click events so we don't fire multiple times

		//Then attach a click event to each anchor tag
		$('a').click(function(evt){
			evt.preventDefault();
			evt.stopPropagation();

			anchorEl = $(this);
			var postUrl = anchorEl.attr('href');

			


			if(postUrl === "/"){//Handle our close button

				var tempHashCheck = window.location.hash;
				if(tempHashCheck.search('categories') != -1){
					$('#post').fadeOut('slow');
					if($('#archive').css('display') === 'block'){
						//Then an archive page is present underneath our post
						//we need to grab it's info and update our url
						window.location.hash = "/archive/" + $('#archive list').attr('category');
						return;
					}

				} else if(tempHashCheck.search('archive') != -1){
					$('#archive').fadeOut('slow');
				}

				window.location.hash = postUrl;
			}else if(postUrl.search('archive') != -1){
				getArchive(postUrl);//go get the archive instead
			} else {
				getPost(postUrl);
			}	

		});


	};//End updateDOM



	//Handle user refresh
	if ($('#body').css('display') === 'block'){
		window.location.hash = "/";
	}




//Get started:
	buildTemplates();


};//End simple blog


window.onload = function(){
	jrSPABlogger(); 
};//End ready




