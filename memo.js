var MEMO_STORAGE = "memo";
var MEMO_ID_STORAGE = "memoid";
var MEMO_ID = 0;
var IS_MEMO_ACTIVATED = "ismemo";
var isMemoActivated = true;

var memoArray = []; // Array of memoObj
var memoLayer;

var memoPositionOffset = 0;

// class memoOBj
function memoObj () {
	var obj = this;
	this.div = document.createElement("DIV");
	this.div.setAttribute("class", "memoBox resizable");
	this.div.setAttribute("draggable", "true");
	memoLayer.appendChild(this.div);
	
	this.id = this.div.id = "memoID="+(MEMO_ID++);
	storage.setItem(MEMO_ID_STORAGE, MEMO_ID);
	this.color = this.div.style.backgroundColor = generateRandomColor(680);
	this.width= this.div.style.width = "200px";
	this.height = this.div.style.height = "200px";
	this.top = this.div.style.top = (200+memoPositionOffset++*15)+"px";
	this.left = this.div.style.left = (50+memoPositionOffset*15)+"px";
	this.contents = "";	
	this.div.setAttribute("onclick", "this.style.zIndex = ++zIndexOffset;");
	this.div.setAttribute("ondragend", "onDragEndMemo(event, this);saveMemoById(this.id)");
	this.div.setAttribute("ondragstart", "onDragStartMemo(event, this)");
	this.div.innerHTML = "<div class='memoTitle'>" +
			"<div class='memoCloseButton transparentButton'>X</div>" +
			"<div class='memoColorButton transparentButton'> <input type='color' value='#ffffff' class='memoColor' oninput='pickColor(this)'></div>" +
			"	</div>	<div class='memoContents' contenteditable='true' ></div>";
	this.div.style.display = "none";
	this.div.style.zIndex = ++zIndexOffset;
	closeButton = this.div.children[0].children[0];
	colorButton = this.div.children[0].children[1];
	this.contentArea = this.div.children[1];
	closeButton.onclick = function () {
		obj.div.style.display = "none";
		var i=0;
		for ( i=0, len=memoArray.length; i<len; i++ )
			if ( memoArray[i] === obj ) break;
		delete memoArray[i];
		clearNullFromArray(memoArray);
		obj.saveMemo();
	}
	this.makeVisible = function ( isPositive ) {		
		if ( Boolean(isPositive) )
			this.div.style.display = "block";
		else
			this.div.style.display = "none";
	}
	this.saveMemo = function () {
		this.width = this.div.style.width;
		this.height = this.div.style.height;
		this.left = this.div.style.left;
		this.top = this.div.style.top;
		this.color = this.div.style.backgroundColor;
		this.contents = this.contentArea.innerHTML;		
		storage.setItem(MEMO_STORAGE, JSON.stringify(memoArray));
	}
	this.div.setAttribute("onmouseup", "saveMemoById(this.id)");
	this.div.setAttribute("onmouseout", "saveMemoById(this.id)");
	this.div.setAttribute("onmousedown", "saveMemoById(this.id)");
	this.contentArea.setAttribute("onblur", "saveMemoById(this.parentNode.id)")
	this.contentArea.setAttribute("oninput", "saveMemoById(this.parentNode.id)");
	return this;
}

function saveMemoById ( id ) {
	for ( i=0, len=memoArray.length ; i<len ; i++ )
		if( memoArray[i].id == id )
			memoArray[i].saveMemo();
}
function addMemo () {
	if ( !isMemoActivated ) {
		printSystemMessage("Toggle memo first");
		return;
	}
	var obj = new memoObj();
	memoArray.push(obj);
	obj.makeVisible(true);
	obj.onmouseover = resizableStart;
	obj.saveMemo();
	printSystemMessage("Memo added");
}
function loadMemo () {
	MEMO_ID = storage.getItem(MEMO_ID_STORAGE);
	isMemoActivated = storage.getItem(IS_MEMO_ACTIVATED);
	
	memoData = JSON.parse(storage.getItem(MEMO_STORAGE));
	if ( memoData === null )
		return;
	if ( isMemoActivated === null)
		isMemoActivated = true;
	for ( var i=0, len=memoData.length ; i<len ; i++ ) {
		temp = new memoObj();
		temp.id = temp.div.id = memoData[i].id;
		temp.div.style.backgroundColor = temp.color = memoData[i].color;
		temp.div.style.color = decideFontColor(temp.div.style.backgroundColor);
		temp.div.style.width = temp.width = memoData[i].width;
		temp.div.style.height = temp.height = memoData[i].height;
		temp.div.style.left = temp.left = memoData[i].left;
		temp.div.style.top = temp.top = memoData[i].top;		
		temp.contentArea.innerHTML = temp.contents = memoData[i].contents;
		temp.makeVisible(isMemoActivated);
		memoArray.push(temp);
	}
}

function clearNullFromArray ( arr ) {
	var counter = 0;
	for ( var i=0, len=arr.length; i<len; i++ ) 
		if ( arr[i] === null || arr[i] === undefined )
			counter++;
	
	arr.sort();
	for ( var i=0; i<counter; i++ )
		arr.pop();
}

function toggleMemo () {
	clearNullFromArray(memoArray);
	isMemoActivated = !isMemoActivated;
	storage.setItem(IS_MEMO_ACTIVATED, isMemoActivated);
	printSystemMessage("Memo toggled:" +isMemoActivated);
	for ( var i=0, len=memoArray.length; i<len ; i++ )
		memoArray[i].makeVisible(isMemoActivated);
}
function deleteAllMemo() {
	memoArray = [];
	storage.removeItem(MEMO_STORAGE);
	storage.removeItem(MEMO_ID_STORAGE);
	storage.removeItem(MEMO_ID);
	var memos = document.getElementsByClassName("memoBox");
	for ( var i=0, len=memos.length; i<len; i++ )
		memos[i].style.display = "none";
	printSystemMessage("Delete all memos");
}

var offsetX=0;
var offsetY=0;
function onDragStartMemo (ev, obj) {
	offsetX = obj.offsetLeft - ev.screenX;
	offsetY = obj.offsetTop - ev.screenY;
}
var zIndexOffset=0;
function onDragEndMemo (ev, obj) {
	var left = offsetX+ev.screenX;
	var top = offsetY+ev.screenY;
	if ( left < -100 )
		left = -100;
	else if ( left > window.innerWidth-100 )
		left = window.innerWidth-100;
	if ( top < -50 )
		top = -50;
	else if ( top > window.innerHeight-50 )
		top = window.innerHeight-50;
	obj.style.left = left+"px";
	obj.style.top = top+"px";
	obj.style.zIndex = ++zIndexOffset;
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
    if ( Number(arr[0])+Number(arr[1])+Number(arr[2]) < 600)
    	return "white";
    else
    	return "black";
}
// brightness 0~765
function generateRandomColor( brightness ) {
	var r,g,b;
	do {
		r = Math.floor((Math.random() * 255) + 1);
		g = Math.floor((Math.random() * 255) + 1);
		b = Math.floor((Math.random() * 255) + 1);
	} while ( brightness > r+g+b );
	return 'rgb('+r+','+g+','+b+')';
}

function resizableStart(e) {
    this.originalW = this.clientWidth;
    this.originalH = this.clientHeight;
    this.onmousemove = resizableCheck;
    this.onmouseup = this.onmouseout = resizableEnd;
}
function resizableCheck(e) {
    if(this.clientWidth !== this.originalW || this.clientHeight !== this.originalH) {
        this.originalX = e.clientX;
        this.originalY = e.clientY;
        this.onmousemove = resizableMove;
    }
}
function resizableMove(e) {
    var newW = this.originalW + e.clientX - this.originalX,
        newH = this.originalH + e.clientY - this.originalY;
    if(newW < this.originalW){
        this.style.width = newW + 'px';
    }
    if(newH < this.originalH){
        this.style.height = newH + 'px';
    }
}
function resizableEnd() {
    this.onmousemove = this.onmouseout = this.onmouseup = null;
}