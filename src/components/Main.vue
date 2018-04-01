<template>
<div>
	<memo-layer></memo-layer>

	<div id="itemLayer">
	</div>

	<div id="inputBox" class="cloudBox" draggable="true">
		<input type="text" class="inputArea" id="inputArea" onkeypress="if(event.keyCode==13) {onInsertButtonClick(); }">
		<button type="button" id="insertButton" >Insert</button>
		<button type="button" class="hideCloudBoxButton">{{ '<' }}</button>
	</div>
	<div id="menuBox" class="cloudBox" draggable="true">
		<button type=button id=addMemoButton>Memo+</button>
		<button type=button id=toggleMemoButton>Memo on/off</button>
		<button type="button" class="hideCloudBoxButton">{{ '>' }}</button>
	</div>
	<div id="itemControlBox" class="cloudBox" draggable="true">
		<div>
			<input type="text" class="inputArea" id="modifyInputArea">
			<button type="button" id="modifyButton" >Modify</button>
		</div>
		<div>
			<input type="date" class="inputArea" id="dateInputArea" max="3000-12-31">
			<button type="button" id="setDeadlineButton">Set</button>
		</div>
		<div>
			<button type='button' id='addChildButton'>Add child</button>
			<button type='button' id="deleteButton">Delete</button>
			<button type='button' id='deleteAllItemButton'>Delete All Items</button>
		</div>
	</div>
	<div id="closeButton"></div>
	<div>
	<table style="margin:auto">
		<tr><td width=500> System Message </td></tr>
		<tr height=100 ><td id="systemMessage"></td></tr>
		<tr><td>
			<button type='button' id='dummyButton' class='blackButton'>Load dummy items</button>
			<button type='button' id='archiveButton' class='blackButton'>Archive on/off</button>
			<button type='button' id='deadlineButton' class='blackButton'>Deadline on/off</button>
		</td></tr>	
		<tr><td>
			<button type='button' id='newDayButton' class='blackButton'>New Day</button>
			<button type='button' id='shiftButton' class='blackButton'>Shift</button>
		</td></tr>
	</table>
	</div>
	<br />
	<br />


	<div id="listLayer">
		<div id="todayArea" class="tableArea">
			<div id="todayTitle" class="tableTitle">Today</div>
			<table id="todayListTable" class="tableBody">
			</table>
		</div>
		<div id="newDayArea" class="tableArea">
			<div id="newDayTitle" class="tableTitle"> New Day</div>
			<table id="newDayTable" class="tableBody" >
			</table>
		</div>
	</div>
	<div id="deadlineArea" class="tableArea" draggable='true'>
		<div id="deadlineTitle" class="tableTitle"> Deadline</div>
		<table id="deadlineTable" class="tableBody">
		</table>
	</div>
	<div id="archiveArea" class="tableArea" draggable='true'>
		<div id="archiveTitle" class="tableTitle"> Archive on/off</div>
		<table id="archiveTable" class="tableBody">
		</table>
	</div>
</div>
</template>
<script>

import MemoLayer from './MemoLayer';

export default {
	name: 'Main',
	components: {
		'memo-layer': MemoLayer
	},
	data() {
		return {
			
		};
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
