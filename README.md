# SPA-Blog

#### SPA Blog is a jQuery based tool, that generates static content into a blog style website.

<a href="#docs">DOCS</a>  |  <a href="#known-issues">Known Issues</a>


####This project is Gary Busey approved:
![Gary Busey Approved](https://cdn.meme.am/images/150x150/14841805.jpg)


<h3 id="docs">DOCS:</h3>
<hr/>
#### There is a how-to on the default template page.
<ul>
<li>Clone and Fork</li>
<li>Serve up with http-server</li>
<li>Read the 1 - 5 steps and use the template as an example. It has a fully functional website with a few templates that still need some CSS love</li>
</ul>

<h5>1. Setup your file structure</h5>
	<ul>
		<li>The two requirements are a "templates" and "categories" folder at your root.</li>
		<ul>
			<li>The categories folder can contain any category you want. Events, news, etc.</li>
			<li>The templates folder will contain our .html files that represent sections of the website.</li>
			<ul>
				<li>In the templates you will need an archives.html, post.html and list.html</li>
				<li>The blogger tool will look for those files, so I recommend adding even blank ones when getting started.</li>
			</ul>
		</ul>
	</ul>
	<img src="http://www.jeremyroelfs.com/resources/SPA-Blog/images/file-struct.png"/>


<h5>2. Add the required JavaScript files</h5>
	<a class="text-center" href="https://github.com/jeremyroelfs/jr-simple-blogger/blob/master/js/lib/jrSimpleBlogger.js">jrSPABlogger</a>
	<a class="text-center" href="https://github.com/jeremyroelfs/jr-simple-blogger/blob/master/js/lib/showdown.js">showdown.js</a>
	<img src="http://www.jeremyroelfs.com/resources/SPA-Blog/images/add-scripts.png"/>


<h5>Add the custom tags to your html</h5>
	<ul>
		<li>template - accesses a template to be rendered<br/>
		<ul>
			<li>link attribute - tells the template engine which template file we want to render</li>
		</ul>
		<li>post - our default view for posts</li>
		<ul>
			<li>template attribute - the template we will use for the post view</li>
		</ul>
		<li>archive - our default view for archives</li>
		<ul>
			<li>template attribute - the template we will use for archive view</li>
		</ul>
	</ul>
	<img src="http://www.jeremyroelfs.com/resources/SPA-Blog/images/tags.png"/>


<h5>Add the List tag where you need to view a list</h5>
	<ul>
		<ul>
			<li>template attribute - the template file we will use to view each individual list item</li>
		
			<li>category attribute- the category we want the posts display from</li>
		
			<li>limit attribute - the number of posts we want displayed at one time in this list. If blank or 0, it will display all the returned posts from the category</li>
		
		</ul>
	</ul>
	<img src="http://www.jeremyroelfs.com/resources/SPA-Blog/images/list.png"/>


<h5>Writting Posts</h5>
	<ul>
		<li>Make sure you have your posts in this structure<br/>
		<ul>
			<li>Category folder</li>
			<li>index.md</li>
			<li>Media that goes along with post. You can use links</li>
			<li>Featured Image. The image along with the index.md is the featured image.</li>
		</ul>
		
	</ul>
	<img src="http://www.jeremyroelfs.com/resources/SPA-Blog/images/post-struct.png"/>




<h5>Metadata and Post Body</h5>
	<ul>
		<ul>
			<li>template attribute - the template file we will use to view each individual list item</li>
			<li>category attribute- the category we want the posts display from</li>
			<li>limit attribute - the number of posts we want displayed at one time in this list. If blank or 0, it will display all the returned posts from the category</li>
		</ul>
		<ul>
			<li>In the post body you can use markdown and/or html. The only catch is. If you index.html has markdown. It will not be parsed as markdown. So I recommend .md and then you have the freedom to utilize both html and markdown.</li>
			<li>Valid file types are: .html, .md, .markdown<ul>
		</ul>
	</ul>
	<img src="http://www.jeremyroelfs.com/resources/SPA-Blog/images/metadata.png"/>





<h3 id="known-issues">Known Issues</h3>

.DS_Store
- This is annoying. But it's not really related to the blog tool. If you keeping getting 404 errors due to a link with DS_Store in it. You need to to remove the .DS_Store files from ALL the directories in your folder structure.
-If you are on make, go to the root folder of the theme directory and use this: 
<code>find . -name '.DS_Store' -type f -delete</code>

