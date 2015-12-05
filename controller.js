var filePath = "C:/Users/Windforce/Dropbox/HciHw2Todolist/todolist.html";

var systemMessageQueue = [];
var storage = window.localStorage;

//// localstorage keys
var SYSTEM_MESSAGE_STORAGE = "sys";
var LAST_DATE = "lastdate";

var inputBox
var inputArea;
var insertButton
var hideInputBoxButton;
var menuBox;
var shiftButton;
var archiveButton;
var archiveArea;
var archiveTable;
var archiveTitle;

var itemControlBox;
var modifyInputArea;
var modifyButton;
var deleteButton;
var boxCloseButton;
var dateInputArea; 
var setDeadlineButton;
var addChildButton;

var listLayer;
var todayArea;
var newDayArea;
var todayListTable;
var newDayTable;
var deadlineTable;
var todayTitle;
var newDayTitle;

function init () {
	
	memoLayer = document.getElementById("memoLayer");
	
	listLayer = document.getElementById("listLayer");
	todayArea = document.getElementById("todayArea");
	newDayArea = document.getElementById("newDayArea");
	todayListTable = document.getElementById("todayListTable");
	newDayTable = document.getElementById("newDayTable");
	deadlineTable = document.getElementById("deadlineTable");
	todayTitle = document.getElementById("todayTitle");
	newDayTitle = document.getElementById("newDayTitle");
	
	inputBox = document.getElementById("inputBox");
	inputArea = document.getElementById("inputArea");
	inputArea.focus();
	insertButton = document.getElementById("insertButton");
	
	itemControlBox = document.getElementById("itemControlBox");
	modifyInputArea = document.getElementById("modifyInputArea");
	modifyButton = document.getElementById("modifyButton");
	addChildButton = document.getElementById("addChildButton");
	deleteButton = document.getElementById("deleteButton");
	dateInputArea = document.getElementById("dateInputArea");
	dateInputArea.min = getTimezoneISOString().slice(0,10);
	setDeadlineButton = document.getElementById("setDeadlineButton");
	boxCloseButton = document.getElementById("closeButton");
	boxCloseButton.onclick = hideControlBox;
	boxCloseButton.target ="";
	shiftButton = document.getElementById("shiftButton");
	shiftButton.setAttribute("onclick", "makeNewDayList();shiftOneDay();");
	archiveArea = document.getElementById("archiveArea");
	archiveTable= document.getElementById("archiveTable");
	archiveTitle = document.getElementById("archiveTitle");
	archiveButton = document.getElementById("archiveButton");
	archiveButton.onclick = onArchiveButtonClick;
	deadlineButton = document.getElementById("deadlineButton");
	deadlineButton.onclick = onDeadlineButtonClick;
	deadlineArea = document.getElementById("deadlineArea");
	
	cloudBox = document.getElementsByClassName("cloudBox");
	for ( i=0; i<cloudBox.length; i++ ) {
		cloudBox[i].setAttribute("ontransitionend", "onCloudBoxTransitionEnd(this)");
		cloudBox[i].setAttribute("onclick", "this.style.zIndex = ++zIndexOffset");
		cloudBox[i].setAttribute("ondragend", "onDragEndMemo(event, this)");
		cloudBox[i].setAttribute("ondragstart", "onDragStartMemo(event, this)");
	}
	deadlineArea.setAttribute("ontransitionend", "onCloudBoxTransitionEnd(this)");
	deadlineArea.setAttribute("ondragend", "onDragEndMemo(event, this)");
	deadlineArea.setAttribute("ondragstart", "onDragStartMemo(event, this)");
	archiveArea.setAttribute("ontransitionend", "onCloudBoxTransitionEnd(this)");
	archiveArea.setAttribute("ondragend", "onDragEndMemo(event, this)");
	archiveArea.setAttribute("ondragstart", "onDragStartMemo(event, this)");
	
	hideCloudBoxButton = document.getElementsByClassName("hideCloudBoxButton");
	for ( i=0; i<hideCloudBoxButton.length; i++ ) {
		hideCloudBoxButton[i].setAttribute("onclick", "hideCloudBox(this)");
	}
	
	dummyButton = document.getElementById("dummyButton");
	numberDummyButton = document.getElementById("numberDummyButton");
	deleteAllItemButton = document.getElementById("deleteAllItemButton");
	deleteAllMemoButton = document.getElementById("deleteAllMemoButton");
	testFunctionButton = document.getElementById("testFunctionButton");
	toggleMemoButton = document.getElementById("toggleMemoButton");
	addMemoButton = document.getElementById("addMemoButton");
	newDayButton = document.getElementById("newDayButton");
	
	insertButton.onclick = onInsertButtonClick;
	
	deleteAllItemButton.onclick = deleteAllItem;
	deleteAllMemoButton.onclick = deleteAllMemo;
	toggleMemoButton.onclick = toggleMemo;
	
	dummyButton.onclick = addDummyList;
	numberDummyButton.onclick = addNumberDummyList;
	testFunctionButton.onclick = onTestButtonClick;
	newDayButton.onclick = onNewDayButtonClick;

	addMemoButton.onclick = addMemo;
	loadMemo();
	var els = document.getElementsByClassName('resizable');
	for(var i=0, len=els.length; i<len; ++i){
	    els[i].onmouseover = resizableStart;
	}
	
	loadList();
	showList( todayArea, todayList.itemArray );
	printSystemMessage();
	setTableTitle();
}
var isArchiveActivated = false;
function onArchiveButtonClick () {
	if ( isArchiveActivated ) {
		isArchiveActivated = false;
		archiveArea.style.display = "none";
		printSystemMessage("Archive Off");
	}
	else {
		isArchiveActivated = true;
		printSystemMessage("Archive On");
		loadArchive();
		archiveArea.style.display = "block";
	}
}

var isDeadlineActivated = false;
function onDeadlineButtonClick () {
	if ( isDeadlineActivated ) {
		isDeadlineActivated = false;
		deadlineArea.style.display = "none";
		printSystemMessage("Deadline Off");
	}
	else {
		isDeadlineActivated = true;
		printSystemMessage("Deadline On");
		deadlineArea.style.display = "block";
		//showlist?
	}
}
function loadArchive ( ) {
	archiveTitle.innerHTML = "Archive";
	if ( !storage.hasOwnProperty(ARCHIVE) ) {
		console.log("loadArchive(): no archive");
		printSystemMessage("No archive!");
		return false;
	}
	else
		archiveData = JSON.parse(storage.getItem(ARCHIVE));
	if ( archiveData.length === 0 ) {
		printSystemMessage("No data in archive!");
	}
	var contents="";
	for ( var i=0, len=archiveData.length; i<len; i++ ) {
		contents += "<tr><td class='tableList' onclick='loadArchiveContents("+i+");archiveTitle.innerHTML=\""+archiveData[i].date+"\";'><strong>"+ archiveData[i].date +
				"</strong><div class='deleteArchiveButton transparentButton' onclick='deleteArchive(event, "+i+");loadArchive();'><strong>X</strong></div></td></tr>";
	}
	archiveTable.innerHTML =contents;
	return true;
}
function loadArchiveContents ( index ) {
	var contents = "";
	for ( var i=0, len=archiveData[index].itemArray.length; i<len; i++ ) {
		if ( archiveData[index].itemArray[i] === null || archiveData[index].itemArray[i] === undefined )
			continue;
		if ( archiveData[index].itemArray[i].isChild )
			continue;
		contents += "<tr><td class='tableList' onclick='loadArchive()'>"+ archiveData[index].itemArray[i].contents +"</td><tr>";
		var childIndices = archiveData[index].itemArray[i].children
		if ( childIndices.length !== 0) {
			for ( var j=0, len=childIndices.length; j<len; j++ ) 
				contents += "<tr><td class='childItem'>"+ archiveData[index].itemArray[childIndices[j]].contents+"</td><tr>";
		}
		
	}
	archiveTable.innerHTML = contents;
}
function deleteArchive ( ev, index ) {
	ev.stopPropagation();
	printSystemMessage("Discarded: "+archiveData[index].date);
	archiveData.splice(index, 1);
	storage.setItem(ARCHIVE, JSON.stringify(archiveData));
}

function setTableTitle () {
	var lastDate = todayList.date;
	var today = getTimezoneISOString().slice(0, 10);
	if ( lastDate === today ) 
		;// nothing happen
	else if ( todayList.itemArray.length === 0 ) {
		todayList = new oneDayList();
		todayTitle.innerHTML= today; 
	}
	else {
		onNewDayButtonClick();// Ready to make new list
		todayTitle.innerHTML = lastDate; 
		newDayTitle.innerHTML = today;
	}
}
var isShiftMode = false;

function onNewDayButtonClick () {
	if ( !isShiftMode ) {
		printSystemMessage("Push [Shift] button to move the list");
		newDayArea.style.display = "initial";
		isShiftMode = true;
		makeNewDayList();
	}
	else {
		newDayArea.style.display = "none";
		isShiftMode = false;
	}
}
function makeNewDayList () {
	newDayList = new oneDayList();
	for ( var i=0, len=todayList.itemArray.length; i<len; i++ ) {
		if ( todayList.itemArray[i].completeness == 2)
			;
		else
			newDayList.itemArray.push(todayList.itemArray[i]);
	}
	if ( isShiftMode ) {
		showList( newDayArea, newDayList.itemArray );
		showList( todayArea, todayList.itemArray );
	}
}
function shiftOneDay() {
	if (!keepInArchive(todayList))
		printSystemMessage("Failed to archiving");
	else 
		printSystemMessage("Last data is archived");
	printSystemMessage("Moved to next list");
	todayList = newDayList;
	storage.setItem(TODAY_ITEM_STORAGE, JSON.stringify(todayList));
	showList(todayArea, todayList.itemArray);
	if ( isShiftMode )
		onNewDayButtonClick();
	setTableTitle();
	loadArchive();
	
}
function deleteAll () {
	deleteAllMemo();
}
function hideControlBox () {
	itemControlBox.style.opacity=0;
	boxCloseButton.style.display = "none";
	if ( boxCloseButton.target ) {
		boxCloseButton.target.style.backgroundColor = 'initial';
	}
	boxCloseButton.target = "";
}

function onCloudBoxTransitionEnd( obj )  { 
	var len = obj.children.length;
	if ( obj.children[len-1].innerHTML === '&gt;' )
		for ( var i=0; i<len-1; i++)
			obj.children[i].style.display='none'; 
	else
		for ( var i=0; i<len-1; i++)
			obj.children[i].style.display='initial';
	
	if ( obj.style.opacity == '0')
		obj.style.display = "none";
}
function hideCloudBox ( obj ) {
	if ( obj.innerHTML === "&lt;" ) {
		obj.parentNode.style.width = "45px"
		obj.innerHTML = ">";
	}
	else {
		obj.parentNode.style.width = "400px";
		obj.innerHTML = "<";
	}
}

function onTestButtonClick () {
//	Alert.render("ANHELLO WORLD");
}

function addDummyList ( ) {
	addItem("Go to school");
	addItem("Do assignment");
	addItem("Eat breakfast");
	addItem("Dinner appointment");
	addItem("Important meeting");
	addItem("Watch TV show");
	printSystemMessage("Dummies added.");
	showList( todayArea, todayList.itemArray );
}

var dummyCounter;
function addNumberDummyList ( ) {	
	printSystemMessage("NumberDummies added.");
	if ( dummyCounter == undefined)
		dummyCounter  = 1;
	for ( c=0 ; c<5 ; c++ )
		addItem(dummyCounter ++);
	showList( todayArea, todayList.itemArray );
}

// message:String
function printSystemMessage ( message ) {
	if ( message === undefined )
		;
	else if ( systemMessageQueue.push(message) === 6 )
		systemMessageQueue.shift();
	
	mqlength = systemMessageQueue.length;
	if ( mqlength === 0) {
		systemMessageQueue.push("No Message");
		mqlength = 1;
	}
	systemMessage = "<strong>" + systemMessageQueue[mqlength-1] + "</strong>";
	for ( i=0 ; i<mqlength-1 ; i++ ) {
		systemMessage += "<br />" + systemMessageQueue[mqlength-2-i];
	}
	document.getElementById("systemMessage").innerHTML = systemMessage;
	storage.setItem(SYSTEM_MESSAGE_STORAGE, JSON.stringify(systemMessageQueue));
}
function getTimezoneISOString () {
	var tzoffset = (new Date()).getTimezoneOffset() * 60000;
	return (new Date(Date.now() - tzoffset)).toISOString();
}