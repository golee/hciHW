var filePath = "C:/Users/Windforce/Dropbox/HciHw2Todolist/todolist.html";
var itemArray = [];
var systemMessageQueue = [];
var storage = window.localStorage;

//// localstorage keys
var TODO_LIST_STORAGE = "todo"
var SYSTEM_MESSAGE_STORAGE = "sys";

function init () {
	
	insertButton = document.getElementById("insertButton");
	dummyButton = document.getElementById("dummyButton");
	deleteAllButton = document.getElementById("deleteAllButton");
	insertButton.onclick = onInsertButtonClick;
	dummyButton.onclick = addDummyList;
	deleteAllButton.onclick = deleteAll;	
	
	callList();
	showList();
	printSystemMessage();
}

function addDummyList ( count ) {
	addItem("Go to school");
	addItem("Do assignment");
	addItem("Eat breakfest");
	addItem("Dinner appointment");
	addItem("Important meeting");
	addItem("Watch TV show");
	printSystemMessage("Dummies added.");
	showList();
}

function deleteAll () {
	itemArray = [];
	storage.clear();
	showList();
	printSystemMessage("Delete all items");
}

function onInsertButtonClick() {
	textBox = document.getElementById("itemName");
	addItem(textBox.value);
	textBox.value="";
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
			todoList += "<tr><td width=400 id=listIndex"+i+" draggable=true ondragstart=onDragstartList(event) ondrop=drop(event) ondragover=allowDrop(event)" +
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
	ev.preventDefault();
}
function onDragstartList(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

// Also index in itemArray is exchanged
function drop(ev) {
    ev.preventDefault();
    data = ev.dataTransfer.getData("text");
    index = data.charAt(9);
    thisIndex = ev.target.id.charAt(9);
    temp = itemArray[index];
    itemArray[index] = itemArray[thisIndex];
    itemArray[thisIndex] = temp;
    storage.setItem(TODO_LIST_STORAGE, JSON.stringify(itemArray));
    showList();
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