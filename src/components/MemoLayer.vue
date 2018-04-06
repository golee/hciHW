<template>
<div class="memo_layer">
	<floating-memo v-for="(memo, index) in memoList" :key="memo.id" :data="memo" :index="index"
		@save="save" @close="remove"></floating-memo>
</div>
</template>

<script>
import Memo from './Memo';

export default {
	name: 'MemoLayer', 
	components: {
		'floating-memo': Memo
	},
	data() {
		return {
			memoList: [],
		};
	},
	methods: {
		newMemo() {
			this.memoList.push({ id:'floatingmemo' + new Date().getTime() });
		},
		save(index, data) {
			if (index != null && data)
				this.memoList.splice(index, 1, data);
			localStorage.setItem('MEMO_STORAGE', JSON.stringify(this.memoList));
		},
		load() {
			var memo = localStorage.getItem('MEMO_STORAGE');
			if ( memo ) {
				this.memoList = JSON.parse(memo);
			}
		},
		remove(index) {
			this.memoList.splice(index, 1);
			this.save();
		}
	},	
	mounted: function() {
		this.load();
	}
};

</script>

<style scoped>

.memo_layer {
	position: absolute;
	left: 0;
	top: 0;
	width: 0;
	height: 0;
	overflow: visible;
}

</style>