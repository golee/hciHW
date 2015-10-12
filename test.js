var filePath = "C:/Users/Windforce/Dropbox/HciHw2Todolist/todolist.html";
var filePath = document.title;
var list = new Array(100);


function init() {
	addItem("Go to school");
	addItem("Eat Dinner");
	addItem("Go to the bed");
	showList();
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
}

// Special effect required (crossing-out)
// index:Number
function deleteItem (index) {
	list[index] = null;
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