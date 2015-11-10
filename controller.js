var filePath = "C:/Users/Windforce/Dropbox/HciHw2Todolist/todolist.html";
var itemArray = [];
var systemMessageQueue = [];
var storage = window.localStorage;

//// localstorage keys
var TODO_LIST_STORAGE = "todo";
var MEMO_STORAGE = "memo";
var SYSTEM_MESSAGE_STORAGE = "sys";
var MEMO_ID_STORAGE= "memoid";
var MEMO_ID=0;

var memoArray = []; // Array of memoObj
var memoLayer;
var inputBox
var inputArea;
var insertButton
var hideInputBoxButton;

function init () {
	memoLayer = document.getElementById("memoLayer");
	
	inputArea = document.getElementById("inputArea");
	inputArea.focus();
	inputBox = document.getElementById("inputBox");
	insertButton = document.getElementById("insertButton");
	hideInputBoxButton = document.getElementById("hideInputBoxButton");
	inputArea = document.getElementById("inputArea");
	
	inputBox.addEventListener("transitionend", function ()  { if ( hideInputBoxButton.innerHTML === "&gt;" ) {inputArea.style.display="none"; insertButton.style.display="none";}});
	
	dummyButton = document.getElementById("dummyButton");
	numberDummyButton = document.getElementById("numberDummyButton");
	deleteAllButton = document.getElementById("deleteAllButton");
	testFunctionButton = document.getElementById("testFunctionButton");
	toggleMemoButton = document.getElementById("toggleMemoButton");
	addMemoButton = document.getElementById("addMemoButton");
	
	insertButton.onclick = onInsertButtonClick;
	hideInputBoxButton.onclick = hideInputBox;
	dummyButton.onclick = addDummyList;
	numberDummyButton.onclick = addNumberDummyList;
	deleteAllButton.onclick = deleteAll;
	testFunctionButton.onclick = onTestButtonClick;
	toggleMemoButton.onclick = toggleMemo;
	addMemoButton.onclick = addMemo;

	var els = document.getElementsByClassName('resizable');
	for(var i=0, len=els.length; i<len; ++i){
	    els[i].onmouseover = resizableStart;
	}
	
	MEMO_ID = storage.getItem(MEMO_ID_STORAGE);
	callList();
	showList();
	printSystemMessage();
}

var memoPositionOffset = 0;
function memoObj () {
	var obj = this;
	this.div = document.createElement("DIV");
	this.div.setAttribute("class", "memoBox resizable");
	this.div.setAttribute("draggable", "true");
	memoLayer.appendChild(this.div);
	
	this.isActivated=false;
	this.id = "memoID="+(MEMO_ID++);
	storage.setItem(MEMO_ID_STORAGE, MEMO_ID)
	this.title="";
	this.color= this.div.style.backgroundColor ="lightblue";
	this.width= this.div.style.width = "200px";
	this.height = this.div.style.height = "200px";
	this.top = this.div.style.top = (100+memoPositionOffset++*15)+"px";
	this.left = this.div.style.left = (50+memoPositionOffset*15)+"px";
	this.contents = "";
	this.div.ondragend = onDragEndMemo;
	this.div.ondragstart = onDragStartMemo;
	this.div.innerHTML = "<div class='memoTitle'>" +
			"<div class='memoCloseButton transparentButton'>X</div>" +
			"<div class='memoColorButton transparentButton'> <input type='color' class='memoColor' oninput='pickColor(this)'></div>" +
			"	</div>	<div class='memoContents' contenteditable='true' ></div>";
	
	this.div.style.display = "none";
	this.closeButton = this.div.children[0].children[0];
	this.colorButton = this.div.children[0].children[1];
	this.contentArea = this.div.children[1];
	this.closeButton.onclick = function () {
		obj.div.style.display = "none";
		var i=0;
		for ( i=0, len=memoArray.length; i<len; i++ )
			if ( memoArray[i] === obj ) break;
		delete memoArray[i];
		clearNullFromArray(memoArray);
	};
	
	this.makeVisible = function () {
		if ( this.isActivated ) {
			this.isActivated = false;
			this.div.style.display = "none";
		}		
		else {
			this.isActivated = true;
			this.div.style.display = "block";
		}
	}
	this.saveMemo = function () {
		this.width = this.div.style.width;
		this.height = this.div.style.height;
		this.left = this.div.style.left;
		this.top = this.div.style.top;
		this.color = this.div.style.backgroundColor;
		this.contents = this.contentArea.innerHTML;
	}
	return this;
}



function clearNullFromArray ( arr ) {
	counter = 0;
	for ( var i=0, len=arr.length; i<len; i++ )
		if ( arr[i] === null || arr[i] === undefined )
			counter++;
	arr.sort();
	for ( var i=0; i<counter; i++ )
		arr.pop();
}

function hideInputBox () {
	if ( hideInputBoxButton.innerHTML === "&lt;" ) {
		inputBox.style.width = "45px"
		hideInputBoxButton.innerHTML = ">";
	}
	else
	{
		inputArea.style.display = "initial";
		insertButton.style.display = "initial";
		inputBox.style.width = "400px";
		hideInputBoxButton.innerHTML = "<";
	}
}
function addMemo () {
	obj = new memoObj();
	memoArray.push(obj);
	obj.makeVisible();
}
function closeAllMemo () {
	
}
function callMemo () {
	memoArray = JSON.parse(storage.getItem(MEMO_STORAGE));
	if ( memoArray == null )
		return;
	else {
		for ( i=0; i<memoArray.length; i++ ) {
			memoBox.style.width = memoArray[i].width;
			memoBox.style.height = memoArray[i].height;
			memoBox.style.left	 = memoArray[i].left;
			memoBox.style.top = memoArray[i].top;
			memoBox.style.backgroundColor = memoArray[i].color;
			memoBox.style.color = decideFontColor(memoArray[i].color);
			memoContents.innerHTML = memoArray[i].contents;
		}
	}
	if ( !memoArray.isActivated )
		;
	else
		memoArray[i].makeVisible();
}
function saveMemo ( memoObj ) {
	memoObj.width = memoBox.style.width;
	memoObj.height = memoBox.style.height;
	memoObj.left = memoBox.style.left;
	memoObj.top = memoBox.style.top;
	memoObj.color = memoBox.style.backgroundColor;
	memoObj.contents = memoContents.innerHTML;
	//storage.setItem(MEMO_STORAGE, JSON.stringify(memoObj));
}
function toggleMemo () {
	clearNullFromArray(memoArray);
	for ( var i=0; i<memoArray.length; i++ )
		memoArray[i].makeVisible();
}

var offsetX;
var offsetY;
function onDragStartMemo (ev ) {
	offsetX = this.offsetLeft - ev.clientX;
	offsetY = this.offsetTop - ev.clientY;
}
function onDragEndMemo ( ev) {
	this.style.left = (offsetX+ev.clientX)+"px";
	this.style.top = (offsetY+ev.clientY)+"px";
	//saveMemo( memoObj );
}

function onTestButtonClick() {
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
	addItem(inputArea.value);
	inputArea.value="";
	showList();
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
			todoList += "<tr><td width=400 class='tableList' id=listIndex"+i+" draggable=true ondragstart=onDragStart(event) ondrop=drop(event) ondragover=allowDrop(event)" +
					 " ondragenter=onDragenterList(event) ondragleave=onDragleaveList(event) ondblclick=modifyItem(this)>" +itemArray[i] + 
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
function modifyItem ( obj ) {
	obj.contentEditable=true;	
	obj.onblur = modify;
}
function modify () {
	this.contentEditable=false;
	index = this.id.slice(9);	
	if ( this.innerHTML === undefined )
		return;
	else
		if ( changeItem(index, this.innerHTML) )
			printSystemMessage("Item changed: >" + this.innerHTML);
	
	showList();
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

function pickColor ( obj ) {
	printSystemMessage(obj.value);
	obj.parentNode.parentNode.parentNode.style.backgroundColor = obj.value;
	obj.parentNode.parentNode.parentNode.style.color = decideFontColor(obj.parentNode.parentNode.parentNode.style.backgroundColor);
}
function decideFontColor(colorValue){
    colorValue = colorValue.replace('rgb(','');
    colorValue = colorValue.replace(')','');
    arr = colorValue.split(", ");
    if ( Number(arr[0])+Number(arr[1])+Number(arr[2]) < 500)
    	return "white";
    else
    	return "black";
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