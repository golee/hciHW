<template>
<div class="memo_layer">
	<floating-memo v-for="memo in memoList" :key="memo.id"></floating-memo>
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
			memoCounter: 0,
			memoList: [],
		};
	},
	methods: {
		newMemo() {
			this.memoList.push({ id:'floatingmemo'+memoCounter++ });
		}
	}
};

</script>

<style scoped>

.memo_layer {
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	hegith: 100%;
}

</style>