
var filePath = "C:/Users/Windforce/Dropbox/HciHw2Todolist/todolist.html";
var filePath = document.title;
var list = new Array(100);

function showList () {
	for (i=0; i<100; i++) {
		if (list[i] != null)
			document.write(list[i] + "<br>");
		else {
			document.write("No more items in the list");
			break;
		}
	}
}

function getTodoList() {
}

function addItem (item) {
	// date, deadlines.
	for (i=0; i<100; i++) {
		if (list[i] != null)
			;
		else {
			list[i] = item;
			document.getElementById("systemMessage").innerHTML = "Item added"
			break;
		}
	}
}

// Special effect required (crossing-out)
function deleteItem () {
	
	
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