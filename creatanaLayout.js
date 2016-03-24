ctnaLayout = true;
if(typeof(ctnaLibrary) == 'undefined'){
  console.log('creatanaLibrary is required to use creatanaLayout get creatanaLibrary at https://github.com/Creatana/creatanaLibrary.js');
}
function setParentHeight (elements, minWidth){
	if(typeof(elements) != 'undefined'){
		if(!Array.isArray(elements)){
			var elements = Array(elements);
		}
		var getNewHeight = true;
	}else{
		var elements=document.getElementsByClassName('parentheight');
		var getNewHeight = false;
	}
	mediaQ = true;
	for (var i=0;i<elements.length;i++){
		elements[i].parentNode.staticHeight = false;
	}
	for (var i=0;i<elements.length;i++){
		var classString = elements[i].getAttribute('class');
		if(typeof(minWidth) == 'undefined'){
			var mediaQ = /parentheight(?=[0-9])[0-9]/.test(classString);
			if(mediaQ){
				var minWidth = classString.match(/parentheight(?=[0-9])[0-9]*/)[0].match(/[0-9]*$/)[0];
			}
		}
		var parent=elements[i].parentNode;
		parent.oHeight = parent.offsetHeight; 
		if(!parent.staticHeight || getNewHeight){
			parent.staticHeight = parseInt(window.getComputedStyle(parent).getPropertyValue('height').replace('px', '')); 
		}
		if(mediaQ){
			doCssAt("min-width:"+minWidth+"px", elements[i], "min-height:"+parent.staticHeight+"px");
		}else{
			addStyle(elements[i], 'min-height', parent.staticHeight+'px');
		}
		
		
		if(elements[i].offsetHeight != parent.staticHeight){
			staticHeight = parent.staticHeight - (elements[i].offsetHeight - parent.staticHeight);
			if(mediaQ){
				doCssAt("min-width:"+minWidth+"px", elements[i], "min-height:"+staticHeight+"px");
			}else{
				addStyle(elements[i], 'min-height', staticHeight+'px');
			}
		}
		
		
		if( parent.oHeight != parent.offsetHeight){
		
			staticHeight = parent.staticHeight - (parent.offsetHeight - parent.oHeight);
		
			if(mediaQ){
				doCssAt("min-width:"+minWidth+"px", elements[i], "min-height:"+staticHeight+"px");
			}else{
				addStyle(elements[i], 'min-height', staticHeight+'px');
		
			}
		}
	}
}
function getRows(className){
  var rowElements = document.getElementsByClassName(className);
  var prevTop = 0;
  var rows = [];
  var row = 0;
  var last = false
  rows[row] = [];
  var matches = 0;
  for(var i=0;i<rowElements.length;i++){
    currentTop = rowElements[i].offsetTop;
    if(currentTop == prevTop || i==0){
      rows[row].push(rowElements[i]);
      prevTop = currentTop;
    }
    if(i != rowElements.length-1){
      var nextTop = rowElements[i+1].offsetTop;
      if(nextTop != currentTop){
	row++;
	rows[row]=[];
	prevTop = nextTop;
      }
    }
  }
  return rows;
}

function getRowsRecursive(className, rowElements){
	if(className != null && rowElements == null){
		rowElements = document.getElementsByClassName(className);
	}
	var prevTop = 0;
	var rows = [];
	var rowTops = [];
	var row = 0;
	var last = false
	rows[row] = [];
	var matches = 0;
	var instance = {};
	for(var i=0;i<rowElements.length;i++){
		currentTop = rowElements[i].offsetTop;
		instance = rowTops.indexOf(currentTop);
		if(instance < 0){
			rowTops.push(currentTop);
			instance = rowTops.length-1
			rows[instance] = [];
		}
		rows[instance].push(rowElements[i]);
	}
	return rows;
}

rowHeightLooped = false;
function maxRowHeight(rows){
	if(rows == null){
		rows = getRowsRecursive('max-height-row');
	}else{
		rows = getRowsRecursive(null, rows);
	}
  for(var i=0;i<rows.length;i++){
    var heights = [];
    var rowElements = rows[i];
    for(var k=0;k<rowElements.length;k++){
      heights.push(parseInt(window.getComputedStyle(rowElements[k]).getPropertyValue('height').replace('px', '')));
    }
    var newHeight = Math.max.apply(null, heights);
    for( k=0;k<rowElements.length;k++){
      addStyle(rowElements[k], 'min-height', newHeight+'px');
    }
  }
    if(!rowHeightLooped){
		rowHeightLooped = true;
		maxRowHeight();
	}else{
		rowHeightLooped = false;
	}
}
function minRowHeight(){
  var rows = getRows('min-height-row');
  for(var i=0;i<rows.length;i++){
    var heights = [];
    var rowElements = rows[i];
    for(var k=0;k<rowElements.length;k++){
      if(rowElements[k].offsetHeight !=0 && typeof(rowElements[k].getElementsByClassName('secondary-height')[0]) == 'undefined'){
	heights.push(rowElements[k].offsetHeight);
	
      }
    }
    if(typeof(heights[0]) != 'undefined'){
      var newHeight = Math.min.apply(null, heights);
      for(var k=0;k<rowElements.length;k++){
	addStyle(rowElements[k], 'height', newHeight+'px');
      }
    }
  }
}
ctnaMatchElements = [];
function parentMatch(loadImages){
	ctnaMatchElements = document.getElementsByClassName('parent-match');
	if(typeof(loadImages) != 'undefined' ){
		for(var i=0; i < ctnaMatchElements.length; i++ ){
			images = ctnaMatchElements[i].getElementsByTagName('img');
			if( images.length > 0 ){
				images[0].addEventListener('load', function(){
				
				matchParents([getParentByClassName(this, 'parent-match')]);
				}, false);
			}
		}
	}else{
		matchParents();
	}
}
function matchParents(matchElements){
  
	var parents = [];
	if(matchElements == null){
		matchElements = ctnaMatchElements;
	}
  // cycle through child elements. Gather all parents.
  // Save a list of children to match height of in each parent element
  for(var i=0;i<matchElements.length;i++){
    var e = matchElements[i];
    var parent = e.parentNode;
    if(typeof(parent.pMatches)=='undefined'){parent.pMatches = [e];}
    else{parent.pMatches.push(e);}
    if( parents.indexOf(e.parentNode) < 0 ){
      parents.push(e.parentNode);
    }
  }
  
// cycle through parents
  for(var i=0;i<parents.length;i++){
    var parent = parents[i];
    var heights = [];
    var secondHeights = [];
  // Gather all child heights and save them.
    for(k=0;k<parent.pMatches.length;k++){
      element = parent.pMatches[k];
	  
	  
	  
	  
      if(element.offsetHeight ==0){
	var secondary = parent.getElementsByClassName('parent-match-backup')[0];
	if(secondary.offsetHeight != 0){
	  secondHeights.push(secondary.offsetHeight);
	}
      }else{
	heights.push(element.offsetHeight);
      }
    }
    
    
  // Apply highest value
    if(heights.length > 0){
      console.log('heights', heights)
      var newHeight = Math.max.apply(null, heights);
      addStyle(parent, 'height', newHeight+'px');
    }else{
      if(secondHeights.length > 0){
	console.log('second', secondHeights)
      var newHeight = Math.max.apply(null, secondHeights);
      addStyle(parent, 'height', newHeight+'px');
      insertClasses(parent, 'secondary-height');
	
      }
    }
    matchToParent = parent.getElementsByClassName('parenthieght');
	if(	matchToParent.length > 0 ){
		setParentHeight(matchToParent);
	}
  }
}
  
  
  
  
function setdocumentheight (){
var e=document.getElementsByClassName('documentheight');
  for (var i=0;i<e.length;i++){
     e[i].setAttribute('style', 'min-height:'+document.body.parentNode.clientHeight+'px');
  }
}
function setdocumentheight100 (){
var e=document.getElementsByClassName('documentheight100');
  for (var i=0;i<e.length;i++){
     e[i].setAttribute('style', 'min-height:'+(document.body.parentNode.clientHeight+100)+'px');
  }
}
function setWindowHeight (){
var e=document.getElementsByClassName('windowheight');
  for (var i=0;i<e.length;i++){
     cloneWindowHeight(e[i]);
  }
}
function cloneWindowHeight(element){
     addStyle(element, 'min-height:'+window.innerHeight+'px');
	
}
function setWindowHeight100 (){
var e=document.getElementsByClassName('windowheight100');
  for (var i=0;i<e.length;i++){
     e[i].setAttribute('style', 'min-height:'+(window.innerHeight+100)+'px');
  }
}

function parentWidth(e){
   return e.parentNode.clientWidth;
}

function classAutoHeight(Xclass){
	var e=document.getElementsByClassName(Xclass);
	var heights=[];
	for(i=0;i<e.length;i++){
		heights.push(e[i].clientHeight);
	}
	var maxHeight = Math.max.apply(null, heights);
	for(var i=0;i<e.length;i++){
   		addStyle(e[i], 'height', maxHeight+'px \!important');
	}
}
