var gCat;
var labelcount;
var startindex;
function getCat(cat,startindex) {
   cat = encodeURIComponent(cat); 
   if(startindex==null)
     var url= '/feeds/posts/summary/-/' + cat + '?max-results=' + maxresults + '&alt=json';
   else
     var url= '/feeds/posts/summary/-/' + cat + '?max-results=' + maxresults + '&start-index=' + startindex + '&alt=json';
   var pars = '';
   gCat = cat;
   
   new Ajax.Request(
       url,
       {
          method: 'get',
          parameters: pars,
          onLoading: function(){Element.show('indicator')},
          onSuccess: showCat,
          onFailure: showFail
       });
}

function showCat(output){
   gCat = decodeURIComponent(gCat); 
   Element.hide('indicator');
   Element.show('search-result');
   $('show-result').innerHTML="";
   var main = string2JSON(output.responseText);
   labelcount = main.feed.openSearch$totalResults.$t;
   startindex = main.feed.openSearch$startIndex.$t;

   if(labelcount == 0){
      showFail();
   }else{
      attachNav();
      attachFeed();

      var xtitle, xcat, xcontent;
      var title, content,catdisplay;
   
    for (i=0; main.feed.entry[i]; i++) {
      xentry = main.feed.entry[i];
      xcontent=xentry.summary.$t;
	  title=document.createElement('h3');
	  title.className="search-title";
	  link=document.createElement('a');
var j = 0;
while (j < xentry.link.length && xentry.link[j].rel != "alternate")
  j++;
	  link.href=xentry.link[j].href;
	  link.innerHTML=xentry.title.$t;
	  title.appendChild(link);
	  $('show-result').appendChild(title);
      content=document.createTextNode(xcontent+"...");
      $('show-result').appendChild(content);
	  catdisplay=document.createElement('div');
	  catdisplay.className='search-cat';
	  catdisplay.innerHTML="<span style=\"color:silver;\"> " + catLabel + "<\/span> ";
      for (var j=0;xentry.category[j];j++) {
         catdisplay.innerHTML+=xentry.category[j].term;
         if(j<xentry.category.length-1)
            catdisplay.innerHTML+=" , ";
      }
	  $('show-result').appendChild(catdisplay);
    }
    $('search-result').style.display="block";
	Element.hide('Blog1');
      attachNav();
  }
}

function attachNav(){
   if(navFlag==1){
      var nav = document.createElement('div');
	  nav.className='search-result-nav';
	  var index;
	  var cnt=Math.ceil(labelcount/maxresults);
	  var navlink;
      for(i=0;i<cnt;i++){
	     index=(i*maxresults)+1;
		 if(index!=(startindex*1)){
		    navlink=document.createElement('a');
			navlink.href="javascript:getCat('" + gCat + "'," + index + ")";
			navlink.innerHTML=(i+1);
			nav.appendChild(navlink);
		 }else{
		    nav.innerHTML+=(i+1);
		 }
		 nav.innerHTML+=" ";
	  }
	  $('show-result').appendChild(nav);
   }
}

function attachFeed(){
   var meta = document.createElement('div');
   meta.className="search-result-meta";
   var metalink = document.createElement('a');
   metalink.href="/feeds/posts/summary/-/"+gCat;
   metalink.innerHTML = "<img src=\"http://sisea00.googlecode.com/files/feed-icon-16x16_green.gif\" title=\"Subscribe to this category\" />";
   metalink.innerHTML+= feedLabel + " " + gCat;
   meta.appendChild(metalink);
   $('show-result').appendChild(meta);
}

function string2JSON(str){
   var n;
   try {
      eval("n="+str);
   }
   catch (e) {
      n= null;
   }
   return n;
}

function showFail(){
   Element.hide('indicator');
   $('show-result').innerHTML="Sorry! Please reload!出错了！请刷新页面重试，谢谢！";
   $('search-result').style.display="block"
}