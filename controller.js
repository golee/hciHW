var filePath = "C:/Users/Windforce/Dropbox/HciHw2Todolist/todolist.html";
var filePath = document.title;
var list = new Array(100);
var storage = window.localStorage;

var insertButton = document.getElementById("insertButton");
var dummyButton = document.getElementById("dummyButton");
var deleteAllButton = document.getElementById("deleteAllButton");
insertButton.onclick = onInsertButtonClick;
dummyButton.onclick = addDummyList;
deleteAllButton.onclick = deleteAll;

function init () {
	callList();
	showList();
}

function addDummyList ( count ) {
	
	addItem("Go to school");
	addItem("do assignment");
	addItem("Eat breakfest");
	addItem("Dinner appointment");
	addItem("Important meeting");
	addItem("Tv show");
	setSystemMessage("Dummies added.");
	showList();
	
}
function deleteAll () {
	list = new Array(100);
	storage.clear();
	showList();
	setSystemMessage("Delete all items");
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
	list = JSON.parse(storage.getItem("todo"));
}

function showList () {
	todoList = "";
	for (i=0; i<100; i++) {
		if (list[i] != null)
			todoList += "<tr><td width=400>" +list[i] + "</td><td><button type=\"button\" onClick=\"deleteItem("+i+")\">Delete</button></td></tr>";
		else 
			;
	}
	if ( todoList === "" )
		todoList = "<tr><td width=400 style='color:red'>!!Nothing to do</td></tr>";
	document.getElementById("todoList").innerHTML = todoList;
}


// item:String
function addItem (item) {
	// date, deadlines.
	if ( item === "" )
	{
		alert("No input(addItem)");
		return -1;
	
	}
	for (i=0; i<100; i++) {
		if (list[i] != null)
			;
		else {
			list[i] = item;
			setSystemMessage("Item added: " + item);
			break;
		}
	}
	storage.setItem("todo", JSON.stringify(list));

}

// Special effect required (crossing-out)
// index:Number
function deleteItem (index) {
	setSystemMessage("Item Deleted: "+ list[index]);
	list[index] = null;
	storage.setItem("todo", JSON.stringify(list));
	
	showList();
}
// Triangle signal
function halfDeleteItem () {
	
}


function changeItem () {
	
}

function writeMemo () {
	
}

function sortItem () {
	
}

// message:String
function setSystemMessage(message) {
	document.getElementById("systemMessage").innerHTML = message;
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