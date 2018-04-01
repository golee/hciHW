<template>

<div class="memo_box resizable" draggable 
	@dragstart="onDragStart" @dragend="onDragEnd"
	:style="boxStyle" :id="id">
	<div class="memo_title">
		<div class="btn_memo_close transparent"
			@click="close">X</div>
		<div class="btn_memo_color transparent">
			<input type="color" class="memo_color"
				v-model="color">
		</div>
	</div>
	<div class="memo_content" contenteditable="true" 
		v-html="content" @change="content=this.innerHTML"></div>
</div>

</template>

<script>
export default {
	name: 'Memo',
	props: ['data'],
	data() {
		return {
			id: 'memobox',
			index: 0,
			zIndex: 0,
			color: this.generateRandomColor(),			
			width: 200,
			height: 200,
			left: 200,
			top: 200,
			offsetX: 0,
			offsetY: 0,
			content: '',
			
		};
	},
	computed: {
		fontcolor() {		
			if ( this.colorSum < 450 )
				return "white";
			else
				return "black";
		},
		colorSum() {
			var colorValue = this.color.replace('#', '');
			var bigint = parseInt(colorValue, 16);
			var r = (bigint >> 16) & 255;
			var g = (bigint >> 8) & 255;
			var b = bigint & 255;
			// colorValue = colorValue.replace('rgb(','');
			// colorValue = colorValue.replace(')','');
			// arr = colorValue.split(", ");
			return Number(r)+Number(g)+Number(b);
		},
		boxStyle() {
			return {
				'background-color': this.color, 
				'color': this.fontcolor,
				'left': this.left + 'px',
				'top': this.top + 'px'
			};
		}
	},
	methods: {
		init() {
			this.id = this.data.id;
		},
		close() {

		},
		save: function() {

		},
		remove () {

		},
		generateRandomColor( brightness ) {
			var r,g,b;
			do {
				r = Math.floor((Math.random() * 255) + 1);
				g = Math.floor((Math.random() * 255) + 1);
				b = Math.floor((Math.random() * 255) + 1);
			} while ( brightness > r+g+b );
			// return 'rgb('+r+','+g+','+b+')';
			return '#'+r.toString(16)+g.toString(16)+b.toString(16);
		},
		onDragStart( ev ) {
			var obj = ev.target;
			this.offsetX = obj.offsetLeft - ev.screenX;
			this.offsetY = obj.offsetTop - ev.screenY;
		},
		onDragEnd( ev ) {
			var obj = ev.target;
			var left = this.offsetX+ev.screenX;
			var top = this.offsetY+ev.screenY;
			if ( left < -100 )
				left = -100;
			else if ( left > window.innerWidth-100 )
				left = window.innerWidth-100;
			if ( top < -50 )
				top = -50;
			else if ( top > window.innerHeight-50 )
				top = window.innerHeight-50;
			this.left = left;
			this.top = top;
			// obj.style.zIndex = ++zIndexOffset;
		}
	}
};
</script>

<style scoped>

.memo_box {
	width: 200px;
	height: 200px;
	top: 200px;
	left: 200px;
	box-shadow: 0px 1.5px 2px 1.5px gray;
	position: absolute;
	background-color: lightpink;
	top: 50px;
	left: 50px;
	resize: both;
	overflow:auto;
	transition:left .5s, top .5s;
}
.memo_box:hover{
	z-index: 100;
}

.memo_title {
	background-color:rgba(100,100,100,0.3);
	position: fixed;
	height: 2em;
	width: inherit;
}
.btn_memo_color {
	position: absolute;
	height: inherit;
	top: 0px;
	right: 10%;
}
.btn_memo_close {
	text-align: center;
	position: absolute;
	height: inherit;
	line-height: 2em;
	width: 10%;
	right: 0px;
	top: 0px;
}
.memo_content {
	text-align: left;
	padding: 10px;
	position: absolute;
	width: 100%;
	height: auto;
	top: 2em;
	bottom: 10px;
	overflow: hidden;	
}


</style>