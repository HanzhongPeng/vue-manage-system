<template>
	<div class="container">
		<div class="plugins-tips">
			vue-schart：vue.js封装sChart.js的图表组件。 访问地址：
			<a href="https://github.com/lin-xin/vue-schart" target="_blank">vue-schart</a>
		</div>
		<el-card class="mgb20" shadow="hover">
			<template #header>
				<div class="content-title">Buggy F1 对比</div>
			</template>
			<schart class="schart" canvasId="buggy-f1" :options="optionsBuggyF1"></schart>
		</el-card>
		<el-card class="mgb20" shadow="hover">
			<template #header>
				<div class="content-title">Macro-F1 对比</div>
			</template>
			<schart class="schart" canvasId="macro-f1" :options="optionsMacroF1"></schart>
		</el-card>
	</div>
</template>

<script setup lang="ts" name="schart">
import Schart from 'vue-schart';

// Buggy F1 数据对比图表配置
const optionsBuggyF1 = {
	type: 'bar',
	title: {
		text: 'Conventional Detection Tools vs MANDO (Buggy F1)'
	},
	colorList: ["#3f51b5", "#009688", "#f44336", "#00bcd4", "#1ABC9C", "#FF9800", "#8BC34A", "#795548"],
	labels: ['Access Control', 'Arithmetic', 'Denial of Service', 'Front Running', 'Reentrancy', 'Time Manipulation', 'Unchecked Low Level Calls'],
	datasets: [
		{
			label: 'Securify',
			data: [13.0, 0.0, 18.0, 53.0, 23.0, 24.0, 11.0]
		},
		{
			label: 'Mythril',
			data: [34.0, 73.0, 41.0, 63.0, 19.0, 23.0, 14.0]
		},
		{
			label: 'Slither',
			data: [32.0, 0.0, 13.0, 26.0, 15.0, 44.0, 10.0]
		},
		{
			label: 'Manticore',
			data: [30.0, 30.0, 12.0, 7.0, 9.0, 24.0, 4.0]
		},
		{
			label: 'Smartcheck',
			data: [20.0, 22.0, 52.0, 0.0, 22.0, 44.0, 11.0]
		},
		{
			label: 'Oyente',
			data: [21.0, 71.0, 48.0, 0.0, 20.0, 24.0, 8.0]
		},
		{
			label: 'MANDO (node2vec)',
			data: [81.98, 84.35, 82.09, 90.51, 86.40, 78.60, 84.81]
		}
	]
};

// Macro-F1 数据对比图表配置
const optionsMacroF1 = {
	type: 'bar',
	title: {
		text: 'Conventional Detection Tools vs MANDO (Macro-F1)'
	},
	colorList: ["#3f51b5", "#009688", "#f44336", "#00bcd4", "#1ABC9C", "#FF9800", "#8BC34A", "#795548"],
	labels: ['Access Control', 'Arithmetic', 'Denial of Service', 'Front Running', 'Reentrancy', 'Time Manipulation', 'Unchecked Low Level Calls'],
	datasets: [
		{
			label: 'Securify',
			data: [52.3, 45.2, 52.0, 72.2, 58.4, 52.4, 54.1]
		},
		{
			label: 'Mythril',
			data: [61.1, 84.1, 60.1, 77.8, 55.3, 50.8, 55.7]
		},
		{
			label: 'Slither',
			data: [61.5, 45.2, 42.7, 56.9, 49.4, 57.3, 53.3]
		},
		{
			label: 'Manticore',
			data: [61.1, 61.0, 48.0, 46.9, 51.2, 55.1, 50.6]
		},
		{
			label: 'Smartcheck',
			data: [56.0, 56.1, 69.9, 46.2, 57.8, 64.2, 54.1]
		},
		{
			label: 'Oyente',
			data: [57.3, 82.8, 48.0, 0.0, 20.0, 52.4, 52.6]
		},
		{
			label: 'MANDO (node2vec)',
			data: [79.23, 79.10, 77.84, 90.29, 86.76, 74.36, 86.74]
		}
	]
};
</script>

<style scoped>
.schart {
	width: 100%;
	height: 400px;
}

.content-title {
	font-weight: 400;
	font-size: 22px;
	color: #1f2f3d;
}
</style>
