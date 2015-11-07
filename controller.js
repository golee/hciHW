var filePath = "C:/Users/Windforce/Dropbox/HciHw2Todolist/todolist.html";
var itemArray = [];
var systemMessageQueue = [];
var storage = window.localStorage;
var memoObj = {isActivated:false, title:"", color:"", width:"", height:"", top:"", left:"", contents:""};

//// localstorage keys
var TODO_LIST_STORAGE = "todo";
var MEMO_STORAGE = "memo";
var SYSTEM_MESSAGE_STORAGE = "sys";

var memoBox;
var memoContents;
var itemInputForm;
var insertButton
var hideInputBoxButton;


function init () {
	
	memoBox = document.getElementById("memoBox");
	memoContents = document.getElementById("memoContents");
	memoCloseButton = document.getElementById("memoCloseButton");
	
	itemInputForm = document.getElementById("itemName");
	itemInputForm.focus();

	insertButton = document.getElementById("insertButton");
	hideInputBoxButton = document.getElementById("hideInputBoxButton");
	dummyButton = document.getElementById("dummyButton");
	numberDummyButton = document.getElementById("numberDummyButton");
	deleteAllButton = document.getElementById("deleteAllButton");
	testFunctionButton = document.getElementById("testFunctionButton");
	memoButton = document.getElementById("toggleMemoButton");
	
	
	insertButton.onclick = onInsertButtonClick;
	hideInputBoxButton.onclick = hideInputBox;
	dummyButton.onclick = addDummyList;
	numberDummyButton.onclick = addNumberDummyList;
	deleteAllButton.onclick = deleteAll;
	testFunctionButton.onclick = onTestButtonClick;
	memoButton.onclick = onMemoButtonClick;
	memoCloseButton.onclick = closeMemo;
	
		
	var els = document.getElementsByClassName('resizable');
	for(var i=0, len=els.length; i<len; ++i){
	    els[i].onmouseover = resizableStart;
	}
	
	callList();
	showList();
	callMemo();
	printSystemMessage();
}

function hideInputBox () {
	if ( hideInputBoxButton.innerHTML === "&lt;" ) {
		itemInputForm.style.display = "none";
		insertButton.style.display = "none";
		hideInputBoxButton.innerHTML = ">";
	}
	else
	{
		itemInputForm.style.display = "initial";
		insertButton.style.display = "initial";
		hideInputBoxButton.innerHTML = "<";
	}
	
}

function closeMemo () {
	memoObj.isActivated=false;
	saveMemo();
	memoBox.style.display="none";
	printSystemMessage("Memo Box saved & off")
	
}
function callMemo () {
	memo = JSON.parse(storage.getItem(MEMO_STORAGE));
	if ( memo == null )
		return;
	else {
		memoObj = memo;
		memoBox.style.width = memoObj.width;
		memoBox.style.height = memoObj.height;
		memoBox.style.left	 = memoObj.left;
		memoBox.style.top = memoObj.top;
		memoContents.innerHTML = memoObj.contents;
	}
	
	if ( !memo.isActivated )
		;
	else
		makeFloatingMemo();
}
function saveMemo () {
	memoObj.width = memoBox.style.width;
	memoObj.height = memoBox.style.height;
	memoObj.left = memoBox.style.left;
	memoObj.top = memoBox.style.top;
	memoObj.contents = memoContents.innerHTML;
	storage.setItem(MEMO_STORAGE, JSON.stringify(memoObj));
}
function onMemoButtonClick () {
	if( !memoObj.isActivated ) {
		makeFloatingMemo();
		printSystemMessage("Memo Box on");
	}
	else {
		closeMemo();
	}
}

function makeFloatingMemo ( ) {
	memoObj.isActivated = true;
	memoBox.style.display = "block";
	saveMemo();
}

var offsetX;
var offsetY;
function onDragStartMemo ( ev ) {
	offsetX = ev.target.offsetLeft - ev.clientX;
	offsetY = ev.target.offsetTop - ev.clientY;
}
function onDragEndMemo ( ev ) {
	//console.log(coord[0]+' '+coord[1]);
	ev.target.style.left = (offsetX+ev.clientX)+"px";
	ev.target.style.top = (offsetY+ev.clientY)+"px";
	saveMemo();
}

function onTestButtonClick() {
	//makeFloatingMemo();
//	Alert.render("ANHELLO WORLD");
}

function addDummyList ( ) {
	console.log(i);
	addItem("Go to school");
	addItem("Do assignment");
	addItem("Eat breakfast");
	addItem("Dinner appointment");
	addItem("Important meeting");
	addItem("Watch TV show");
	printSystemMessage("Dummies added.");
	showList();
}

var counter;
function addNumberDummyList ( ) {	
	printSystemMessage("NumberDummies added.");
	if ( counter == undefined)
		counter = 1;
	for ( c=0 ; c<5 ; c++ )
		addItem(counter++);
	showList();
}

function deleteAll () {
	itemArray = [];
	storage.removeItem(TODO_LIST_STORAGE);
	showList();
	printSystemMessage("Delete all items");
}

function onInsertButtonClick() {
	addItem(itemInputForm.value);
	itemInputForm.value="";
	showList();
}

function onDeleteButtonClick() {	
}

function callList() {
	itemArray = JSON.parse(storage.getItem(TODO_LIST_STORAGE));
	if ( itemArray == null )
		itemArray = [];
	systemMessageQueue = JSON.parse(storage.getItem(SYSTEM_MESSAGE_STORAGE));
	if ( systemMessageQueue == null )
		systemMessageQueue = [];
}

function showList () {
	todoList = "";
	for (i in itemArray) {
		if (itemArray[i] != null)
			todoList += "<tr><td width=400 id=listIndex"+i+" draggable=true ondragstart=onDragStart(event) ondrop=drop(event) ondragover=allowDrop(event)" +
					 " onmousedown=onMousedownList(this) onmouseup=makeWhite(this) onmouseover=onMouseoverList(this) ondragenter=onDragenterList(event) ondragleave=onDragleaveList(event) " +
				" onmouseout=makeWhite(this) onClick=onClickList("+i+")>" +itemArray[i] + 
				"</td><td><button type=\"button\" onClick=\"deleteItem("+i+")\">Delete</button></td></tr>";
		else 
			;
	}
	if ( todoList == "" )
		todoList = "<tr><td width=400 style='color:red'><strong>Nothing to do</td></strong></tr>";
	document.getElementById("todoList").innerHTML = todoList;
}

function allowDrop(ev) {
	data = ev.dataTransfer.getData("text");
	if ( ev.target.id.search("listIndex") === -1 ) 
		if ( data.search("listIndex") != -1) return;
	
	ev.preventDefault();

}
function onDragStart(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

// Also index in itemArray is exchanged
function drop(ev) {
    ev.preventDefault();
    data = ev.dataTransfer.getData("text");
    if ( data.search("listIndex") !== -1 ) {
    	if ( ev.target.id.search("listIndex") !== -1 ) {
		    index = data.slice(9);
		    thisIndex = ev.target.id.slice(9);
		    temp = itemArray[index];
		    itemArray[index] = itemArray[thisIndex];
		    itemArray[thisIndex] = temp;
		    storage.setItem(TODO_LIST_STORAGE, JSON.stringify(itemArray));
		    showList();
    	}
    }
    else {
    	
    }
}
function onMousedownList ( obj ) {
	obj.style.background="lightblue";	
}
function makeWhite( obj ) {
	obj.style.background = "white";
}
function onClickList ( index ) {
	changeTo = prompt("Change to...","");
	if ( changeTo == null)
		return;
	if ( changeItem(index, changeTo) )
		printSystemMessage("Item changed: "+document.getElementById("listIndex"+index).innerHTML + " > " + changeTo);
	showList();
}
function onMouseoverList ( obj ) {
	obj.style.background = "gray";
}
function onDragenterList ( ev ) {
	if ( ev.target.id == ev.dataTransfer.getData("text") )
		;
	else ev.target.style.background = "pink";
}
function onDragleaveList ( ev ) {
	if ( ev.target.id == ev.dataTransfer.getData("text") )
		;
	else ev.target.style.background = "white";
}

// item:String
function addItem ( item ) {
	// date, deadlines.
	if ( item == "" )
	{
		alert("No input(addItem)");
		printSystemMessage("No input");
		return -1;
	}
	itemArray.push(item);
	printSystemMessage("Item added:" + item);
	storage.setItem(TODO_LIST_STORAGE, JSON.stringify(itemArray));
}

function changeItem ( index, item ) {
	if ( item === "" ) {
		alert("No input(addItem)");
		return false;
	}
	itemArray[index] = item;
	storage.setItem(TODO_LIST_STORAGE, JSON.stringify(itemArray));
	return true;
}

// Special effect required (crossing-out)
// index:Number
function deleteItem ( index ) {
	printSystemMessage("Item Deleted: "+ itemArray[index]);
	itemArray.splice(index, 1);
	storage.setItem(TODO_LIST_STORAGE, JSON.stringify(itemArray));	
	showList();
}
// Triangle signal
function halfDeleteItem () {
}

function writeMemo () {
}

function sortItem () {
}

// message:String
function printSystemMessage ( message ) {
	if ( message === undefined )
		;
	else if ( systemMessageQueue.push(message) === 6 )
		systemMessageQueue.shift();
	
	mqlength = systemMessageQueue.length;
	systemMessage = "<strong>" + systemMessageQueue[mqlength-1] + "</strong>";
	for ( i=0 ; i<mqlength-1 ; i++ ) {
		systemMessage += "<br />" + systemMessageQueue[mqlength-2-i];
	}
	document.getElementById("systemMessage").innerHTML = systemMessage;
	storage.setItem(SYSTEM_MESSAGE_STORAGE, JSON.stringify(systemMessageQueue));
}

function CustomAlert(){
    this.render = function(dialog){
        var winW = window.innerWidth;
        var winH = window.innerHeight;
        var dialogoverlay = document.getElementById('dialogoverlay');
        var dialogbox = document.getElementById('dialogbox');
        dialogoverlay.style.display = "block";
        dialogoverlay.style.height = winH+"px";
        dialogbox.style.left = (winW/2) - (400 * .5)+"px";
        dialogbox.style.top = "100px";
        dialogbox.style.display = "block";
        document.getElementById('dialogboxhead').innerHTML = "Message";
        document.getElementById('dialogboxbody').innerHTML = dialog;
        document.getElementById('dialogboxfoot').innerHTML = '<button onclick="Alert.ok()">OK</button>';
    }
	this.ok = function(){
		document.getElementById('dialogbox').style.display = "none";
		document.getElementById('dialogoverlay').style.display = "none";
	}
}
var Alert = new CustomAlert();


function resizableStart(e){
    this.originalW = this.clientWidth;
    this.originalH = this.clientHeight;
    this.onmousemove = resizableCheck;
    this.onmouseup = this.onmouseout = resizableEnd;
}
function resizableCheck(e){
    if(this.clientWidth !== this.originalW || this.clientHeight !== this.originalH) {
        this.originalX = e.clientX;
        this.originalY = e.clientY;
        this.onmousemove = resizableMove;
    }
}
function resizableMove(e){
    var newW = this.originalW + e.clientX - this.originalX,
        newH = this.originalH + e.clientY - this.originalY;
    if(newW < this.originalW){
        this.style.width = newW + 'px';
    }
    if(newH < this.originalH){
        this.style.height = newH + 'px';
    }
}
function resizableEnd(){
    this.onmousemove = this.onmouseout = this.onmouseup = null;
}


/* Optional requirements
 *  Analog graphic effects
 *  Experiential gestures
 *  Anything i suggest of?
*/

/* Submission materials
 * 	Short report highlighting system UI design
 * 	Zipped source file, excutable at Chrome
 * 	Name it informatively
 */