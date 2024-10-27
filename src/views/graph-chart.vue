<template>
	<div class="container">
		<!-- <div class="plugins-tips">
			vue-schart：vue.js封装sChart.js的图表组件。 访问地址：
			<a href="https://github.com/lin-xin/vue-schart" target="_blank">vue-schart</a>
		</div> -->
		<el-card class="mgb20" shadow="hover">
			<template #header>
				<div class="content-title">优化算法与传统算法Buggy-F1对比</div>
			</template>
			<schart class="schart" canvasId="buggy-f1" :options="optionsBuggyF1"></schart>
		</el-card>
		<el-card class="mgb20" shadow="hover">
			<template #header>
				<div class="content-title">优化算法与传统算法Macro-F1对比</div>
			</template>
			<schart class="schart" canvasId="macro-f1" :options="optionsMacroF1"></schart>
		</el-card>
        <el-card class="mgb20" shadow="hover">
			<template #header>
				<div class="content-title">优化算法与图神经网络算法Buggy-F1对比</div>
			</template>
			<schart class="schart" canvasId="buggy-f1-graph" :options="optionsBuggyF1graph"></schart>
		</el-card>
        <el-card class="mgb20" shadow="hover">
			<template #header>
				<div class="content-title">优化算法与图神经网络算法Macro-F1对比</div>
			</template>
			<schart class="schart" canvasId="macro-f1-graph" :options="optionsMacroF1graph"></schart>
		</el-card>
	</div>
</template>

<script setup lang="ts" name="schart">
import Schart from 'vue-schart';

// Buggy F1 数据对比图表配置
const optionsBuggyF1 = {
	type: 'bar',
	title: {
		text: ' 优化算法与传统算法比较 (Buggy F1)'
	},
	colorList: ["#3f51b5", "#009688", "#f44336", "#00bcd4", "#1ABC9C", "#FF9800", "#8BC34A", "#795548"],
	labels: ['访问控制漏洞', '算术漏洞', '拒绝服务漏洞', '抢先交易漏洞', '重入漏洞', '时间操作漏洞', '未检查的低级调用漏洞'],
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
			label: '优化算法',
			data: [81.98, 84.35, 82.09, 90.51, 86.40, 78.60, 84.81]
		}
	]
};

// Macro-F1 数据对比图表配置
const optionsMacroF1 = {
	type: 'bar',
	title: {
		text: '优化算法与传统算法比较 (Macro-F1)'
	},
	colorList: ["#3f51b5", "#009688", "#f44336", "#00bcd4", "#1ABC9C", "#FF9800", "#8BC34A", "#795548"],
	labels: ['访问控制漏洞', '算术漏洞', '拒绝服务漏洞', '抢先交易漏洞', '重入漏洞', '时间操作漏洞', '未检查的低级调用漏洞'],
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
			label: '优化算法',
			data: [79.23, 79.10, 77.84, 90.29, 86.76, 74.36, 86.74]
		}
	]
};

// Buggy F1 数据对比图表配置
const optionsBuggyF1graph = {
	type: 'bar',
	title: {
		text: '其他图神经网络方法 vs 优化算法 (Buggy F1)'
	},
	colorList: ["#3f51b5", "#009688", "#f44336", "#00bcd4", "#1ABC9C", "#FF9800"],
	labels: ['访问控制漏洞', '算术漏洞', '拒绝服务漏洞', '抢先交易漏洞', '重入漏洞', '时间操作漏洞', '未检查的低级调用漏洞'],
	datasets: [
		{
			label: 'Heterogeneous GNN',
			data: [62.90, 56.46, 55.17, 63.40, 61.79, 66.29, 55.22]
		},
		{
			label: 'GCN',
			data: [60.63, null, 60.12, null, null, 59.60, null]
		},
		{
			label: 'LINE',
			data: [61.45, 33.41, 59.61, 62.61, 66.23, 66.65, 60.51]
		},
		{
			label: 'node2vec',
			data: [62.63, 58.59, 56.41, 64.77, 58.29, 63.03, 61.69]
		},
		{
			label: '优化算法',
			data: [89.15, 59.44, 87.71, 89.86, 71.04, 83.86, 73.38]
		}
	]
};

// Macro-F1 数据对比图表配置
const optionsMacroF1graph = {
	type: 'bar',
	title: {
		text: '其他图神经网络方法 vs 优化算法 (Macro-F1)'
	},
	colorList: ["#3f51b5", "#009688", "#f44336", "#00bcd4", "#1ABC9C", "#FF9800"],
	labels: ['访问控制漏洞', '算术漏洞', '拒绝服务漏洞', '抢先交易漏洞', '重入漏洞', '时间操作漏洞', '未检查的低级调用漏洞'],
	datasets: [
		{
			label: 'Heterogeneous GNN',
			data: [42.55, 46.32, 44.49, 43.03, 47.26, 45.94, 49.05]
		},
		{
			label: 'GCN',
			data: [48.45, null, 45.65, null, null, 46.60, null]
		},
		{
			label: 'LINE',
			data: [40.88, 33.47, 35.77, 34.29, 37.91, 40.84, 40.08]
		},
		{
			label: 'node2vec',
			data: [48.83, 50.80, 40.63, 46.08, 45.80, 46.78, 49.91]
		},
		{
			label: '优化算法',
			data: [89.46, 66.16, 86.41, 88.66, 74.97, 86.05, 66.10]
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
