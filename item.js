var TODAY_ITEM_STORAGE = "today";
var ARCHIVE = "archive";
var archiveData;

function oneDayList () {
	this.typeId = "oneDayList";
	this.date = new Date().toISOString().slice(0,10);
	this.itemArray = [];
	return this;
}

var todayList = new oneDayList();
var newDayList = new oneDayList();
var deadlineArray = [];

function item ( text ) {
	this.id = "";
	this.completeness = 0;
	this.contents = text;
	this.deadline;
	this.children = []; // Array of index number
	this.isChild = false;
	this.parent;
	return this;
}

function keepInArchive ( itemList ) {
	if ( itemList===null || itemList===undefined ) {
		console.log("keepInArchive():null|undefined input");
		return false;
	}
	else if ( itemList.typeId===null || itemList.typeId !=="oneDayList" ) {
		console.log("keepInArchive():Wrong typeId:"+itemList.typeId);
		return false; 
	}
	else {
		var deleteTargets = [];
		var readyList = itemList;
		for ( var i=0, len=readyList.itemArray.length; i<len; i++ ) {
			if ( readyList.itemArray[i].deadline !== undefined ) {
				deleteTargets.push(i);
				if ( readyList.itemArray[i].children.length !== 0 )
					deleteTargets = deleteTargets.concat(readyList.itemArray[i].children);
			}
		}
		var dlen = deleteTargets.length;
		for ( var i=dlen-1; i>=0; i-- )
			delete readyList.itemArray[deleteTargets[i]];
		if ( !storage.hasOwnProperty(ARCHIVE) )
			archiveData = [];
		else
			archiveData = JSON.parse(storage.getItem(ARCHIVE));
		archiveData.push(readyList)
		storage.setItem(ARCHIVE, JSON.stringify(archiveData));
		return true;
	}
}

function loadList() {
	todayList = JSON.parse(storage.getItem(TODAY_ITEM_STORAGE));
	if ( todayList === null || todayList.typeId !== "oneDayList" )
		todayList = new oneDayList();
	systemMessageQueue = JSON.parse(storage.getItem(SYSTEM_MESSAGE_STORAGE));
	if ( systemMessageQueue == null )
		systemMessageQueue = [];
}

function showList ( tableArea, listArray ) {
	tableArea.removeChild(tableArea.getElementsByTagName("TABLE")[0]);
	var tableObject = document.createElement("TABLE");
	tableObject.setAttribute("class", "tableBody");
	emptyTable = "<tr><td id='listIndex999' class='tableList' ondragover='allowDrop(event, this)' ondrop='drop(event, this)'" +
			" onclick='inputBox.style.left=event.clientX+\"px\";inputBox.style.top=event.clientY+\"px\";inputArea.focus();'></td></tr>";
	var tableContents = "";
	var deadlineIndices = [];
	var deadlineContents = "";
	var clen = 0; // length of children
	for ( var i=0, len=listArray.length; i<len; i++ ) {
		if (listArray[i] != null) {
			if ( listArray[i].isChild )
				continue;
			clen=listArray[i].children.length;
			if ( listArray[i].deadline !== undefined ) {
				 deadlineIndices.push(i);
			 }
			else {
				tableContents += "<tr><td class='tableList' id='listIndex"+i+"' draggable='true' ondragstart='onDragStart(event)' ondrop='drop(event, this)' ondragover='onDragOverList(event, this)'"
						 + " ondragleave='onDragleaveList(event)' onclick='callControlCloud("+i+", this)'>";
				if ( tableArea.id === "todayArea" ) {
					 tableContents+= "<div class='completenessIcon' onclick='progressAhead("+i+", this)' draggable='true' ondragover='allowDrop(event)' ondragstart='readyLink(this)' ondrop='link()'></div>"
				}
				else
					tableContents += "<div></div>";
				tableContents += "<div ondragover='onDragOverList(event, this.parentNode)' ondrop='drop(event, this.parentNode)'>"+listArray[i].contents+"</div></td></tr>" ;
				if ( clen !==0 ) {
					for ( var j=0; j<clen; j++ ) {
						tableContents += "<tr><td class='childItem' id='listIndex"+listArray[i].children[j]+"' onclick='callControlCloud("+listArray[i].children[j]+", this)'><div></div><div>"+listArray[listArray[i].children[j]].contents+"</div></td></tr>"
					}
				}
			}
		}
		else
			tableContents += emptyTable;
	}
	if ( tableContents.length ===0 ) {
		tableContents = emptyTable;
	}
	deadlineIndices.sort(function(a, b) {
	    return parseInt(listArray[a].deadline.replace(/-/g, '')) - parseInt(listArray[b].deadline.replace(/-/g, ''));
	});
	for (var i=0, len=deadlineIndices.length; i<len; i++ ) {
		clen = listArray[deadlineIndices[i]].children.length;
		deadlineContents += "<tr ><td  rowspan='"+(clen+1)+"'>" + listArray[deadlineIndices[i]].deadline+"</td><td class='tableList' id='listIndex"+deadlineIndices[i]+"' ondrop='drop(event, this)' onclick='callControlCloud("+deadlineIndices[i]+", this)'>" +
			"<div class='completenessIcon' onclick='progressAhead("+deadlineIndices[i]+", this)' draggable='true' ondrop='link()'></div><div>"+listArray[deadlineIndices[i]].contents+"</div></td>";
		if ( clen !==0 ) {
			for ( var j=0; j<clen; j++ ) {
				deadlineContents += "<tr><td class='childItem' id='listIndex"+listArray[deadlineIndices[i]].children[j]+"' onclick='callControlCloud("+listArray[deadlineIndices[i]].children[j]+", this)'><div></div><div>"+listArray[listArray[deadlineIndices[i]].children[j]].contents+"</div></td></tr>"
			}
		}
		deadlineContents += "</tr>";
	}
	deadlineContents += "";
	if ( deadlineContents.length === 0 ) {
		deadlineContents = emptyTable;
	}
	tableObject.innerHTML = tableContents;
	tableArea.appendChild(tableObject);
	tableArea.style.display="inline-block";
	deadlineTable.innerHTML = deadlineContents;
	
	cIcons = tableObject.getElementsByClassName("completenessIcon");
	for ( var i=0, len=cIcons.length; i<len; i++ ) {
		obj = cIcons[i];
		switch ( listArray[cIcons[i].parentNode.id.slice(9)].completeness ) {
			case 0: obj.style.backgroundColor="initail";break;
			case 1: obj.style.backgroundColor="yellow";break;
			case 2: obj.style.backgroundColor="green";break;
			default:printSystemMessage("showList():Invalid Complete state");
		}
	}
}

// not used
function sortTodayList() {
	var tempArr = [];
	var len = todayList.itemArray.length;
	for ( var i=len-1; i>=0; i-- ) {
		if ( todayList.itemArray[i].deadline !== undefined ) {
			tempArr.push(todayList.itemArray[i]);
			deleteItem(i);
		}
		else
			;
	}
	tempArr.sort(function(a, b) {
	    return parseInt(a.deadline.replace(/-/g, '')) - parseInt(b.deadline.replace(/-/g, ''));
	});
	todayList.itemArray = todayList.itemArray.concat(tempArr);
	storage.setItem(TODAY_ITEM_STORAGE, JSON.stringify(todayList));
}

function onSetDeadlineButtonClick ( index ) {
	printSystemMessage("Deadline setted: "+dateInputArea.value);
	todayList.itemArray[index].deadline = dateInputArea.value;
	storage.setItem(TODAY_ITEM_STORAGE, JSON.stringify(todayList));
	showList( todayArea, todayList.itemArray );
	hideControlBox();
}
function progressAhead( index, obj ) {	// only for today
	event.cancelBubble = true;
	var com = ++(todayList.itemArray[index].completeness);
	switch ( com ) {
	case 1: 
		obj.style.backgroundColor="yellow";break;
	case 2: 
		obj.style.backgroundColor="green";
		makeNewDayList();break;
	case 3: 
		obj.style.backgroundColor="initial";
		todayList.itemArray[index].completeness=0;break;
	default: todayList.itemArray[index].completeness = 0;	
	}
	storage.setItem(TODAY_ITEM_STORAGE, JSON.stringify(todayList));
}

function deleteAllItem () {
	todayList = new oneDayList();
	storage.removeItem(TODAY_ITEM_STORAGE);
	showList( todayArea, todayList.itemArray );
	hideControlBox();
	printSystemMessage("Delete all items");
}
function allowDrop(ev) {
	ev.stopPropagation();
	data = ev.dataTransfer.getData("text");
	if ( ev.target.id.search("listIndex") !== -1  || ev.target.parentNode.id.search("listIndex") !== -1) {
		if ( data.search("listIndex") == -1) return;
		else ev.preventDefault();
	}
	else if ( ev.target.className == 'completenessIcon')
		;
}

function onDragOverList ( ev, targetObj ) {
	allowDrop(ev);
	if ( targetObj.id == ev.dataTransfer.getData("text") )
		;
	else if ( targetObj.tagName === "TD")
		targetObj.style.background = "pink";
}	
function onDragStart ( ev ) {
    ev.dataTransfer.setData("text", ev.target.id);
}
// Also index in itemArray is exchanged
// Can add to deadline
function drop ( ev, targetObj ) {
	ev.stopPropagation();
    ev.preventDefault();
    data = ev.dataTransfer.getData("text");
    if ( data.search("listIndex") !== -1 ) {
    	if ( targetObj.id.search("listIndex") !== -1 ) {
		    index = data.slice(9);
		    thisIndex = targetObj.id.slice(9);
		    if ( thisIndex==999 || todayList.itemArray[thisIndex].deadline !== undefined ) {
		    	todayList.itemArray[index].deadline = new Date().toISOString().slice(0,10);
		    	showList( todayArea, todayList.itemArray );
		    }
		    else {
			    temp = todayList.itemArray[index];
			    todayList.itemArray[index] = todayList.itemArray[thisIndex];
			    todayList.itemArray[thisIndex] = temp;
			    showList( todayArea, todayList.itemArray );
		    }
		    storage.setItem(TODAY_ITEM_STORAGE, JSON.stringify(todayList));
    	}
    }
    else {
    }
}
function onDragleaveList ( ev ) {
	if ( ev.target.id == ev.dataTransfer.getData("text") )
		;
	else if ( ev.target.tagName === "DIV")
		;
	else
		ev.target.style.background = "initial";
}
function callControlCloud ( index, obj ) {
	if ( boxCloseButton.target !== "" ){
		return;
	}
	if ( todayList.itemArray[index].isChild) {
		dateInputArea.style.display = 'none';
		setDeadlineButton.style.display = 'none';
		addChildButton.style.display = 'none';
	}
	else {
		dateInputArea.style.display = 'initial';
		setDeadlineButton.style.display = 'initial';
		addChildButton.style.display = 'initial';
	}
	obj.style.backgroundColor = 'darkgray';
	itemControlBox.style.display="initial";
	var rect = obj.getBoundingClientRect();
	var left = rect.right+10+window.pageXOffset;
	
	if ( left +300 > window.innerWidth )
		itemControlBox.style.left = rect.left-400+window.pageXOffset+"px";
	else
		itemControlBox.style.left = left+"px";

	itemControlBox.style.top = rect.top+window.pageYOffset+"px";
	itemControlBox.style.opacity = "1";
	boxCloseButton.style.display = "initial";
	boxCloseButton.target = obj;
	modifyInputArea.value = obj.children[1].innerHTML;
	modifyInputArea.setAttribute("onkeypress", "if(event.keyCode==13) {onClickModifyButton("+index+"); }");
	//modifyInputArea.setAttribute("onblur", "onClickModifyButton("+index+")");
	modifyButton.setAttribute("onclick", "onClickModifyButton("+index+")");
	if ( todayList.itemArray[index].deadline === undefined ) {
		dateInputArea.value = new Date().toISOString().slice(0, 10);
	}else {
		dateInputArea.value = todayList.itemArray[index].deadline;
	}
	setDeadlineButton.setAttribute("onclick", "onSetDeadlineButtonClick("+index+")");
	deleteButton.setAttribute("onclick", "onClickDeleteButton("+index+")");
	addChildButton.setAttribute("onclick", "onAddChildButtonClick("+index+")");
}
function onAddChildButtonClick ( index ) {
	var child = new item( "" );
	child.isChild = true;
	child.parent = index;
	var childIndex = index+todayList.itemArray[index].children.length+1;
	todayList.itemArray.splice(childIndex, 0, child);
	todayList.itemArray[index].children.push(childIndex);
	storage.setItem(TODAY_ITEM_STORAGE, JSON.stringify(todayList));
	showList(todayArea, todayList.itemArray);
	hideControlBox();
	callControlCloud(childIndex, document.getElementById("listIndex"+(childIndex)));
}
function addItem ( contents ) {
	if ( contents == "" ) {
		printSystemMessage("addItem: No input");
		return -1;
	}
	var obj =new item(contents); 
	todayList.itemArray.push(obj);
	printSystemMessage("Item added: " + contents);
	storage.setItem(TODAY_ITEM_STORAGE, JSON.stringify(todayList));
}
function modifyItem ( index, text ) {
	if ( text == "" ) {
		return false;
	}
	else if ( todayList.itemArray[index].contents === text ) {
		return false;
	}
	else {
		todayList.itemArray[index].contents = text;
		storage.setItem(TODAY_ITEM_STORAGE, JSON.stringify(todayList));
		return true;
	}
}

function deleteItem ( index ) {
	if ( todayList.itemArray[index].isChild ) {	// delete reference in parent item
		var childArr = todayList.itemArray[todayList.itemArray[index].parent].children;
		var len = childArr.length;
		for ( var i=0; i<len; i++ ) {
			if ( childArr[i] == index ) {
				todayList.itemArray[todayList.itemArray[index].parent].children.splice(i, 1);
				break;
			}
		}
		todayList.itemArray.splice(index, 1);
	}
	else if ( todayList.itemArray[index].children.length !== 0) {
		var deleteTargets = todayList.itemArray[index].children.concat(index);
		deleteTargets.sort();
		len = deleteTargets.length;
		for ( var i=len-1; i>=0; i-- ) {
			todayList.itemArray.splice(deleteTargets[i], 1);
		}
	}
	else
		todayList.itemArray.splice(index, 1);
	
	storage.setItem(TODAY_ITEM_STORAGE, JSON.stringify(todayList));	
	return true;
}
function onClickModifyButton ( index ) {
	if ( modifyItem(index, modifyInputArea.value) ) {
		printSystemMessage("Item modified: " + modifyInputArea.value);
		modifyInputArea.value = "";
		showList( todayArea, todayList.itemArray );
		makeNewDayList();
	}
}
function onInsertButtonClick() {
	addItem(inputArea.value);
	inputArea.value="";
	showList( todayArea, todayList.itemArray );
	makeNewDayList();
}
function onClickDeleteButton ( index ) {
	if ( deleteItem(index) ) {
		printSystemMessage("Item Deleted");
		hideControlBox();
		makeNewDayList();
		showList( todayArea, todayList.itemArray);
	}
	else {
		console.log("fail delete");
	}
}