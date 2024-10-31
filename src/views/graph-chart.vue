<template>
	<div class="container">
		<!-- <div class="plugins-tips">
			vue-schart：vue.js封装sChart.js的图表组件。 访问地址：
			<a href="https://github.com/lin-xin/vue-schart" target="_blank">vue-schart</a>
		</div> -->
		<el-card class="mgb20" shadow="hover">
			<template #header>
				<div class="content-title">基于异构图的多级漏洞检测算法与传统算法Buggy-F1对比</div>
			</template>
			<schart class="schart" canvasId="buggy-f1" :options="optionsBuggyF1"></schart>
		</el-card>
		<el-card class="mgb20" shadow="hover">
			<template #header>
				<div class="content-title">基于异构图的多级漏洞检测算法与传统算法Macro-F1对比</div>
			</template>
			<schart class="schart" canvasId="macro-f1" :options="optionsMacroF1"></schart>
		</el-card>
        <!-- <el-card class="mgb20" shadow="hover">
			<template #header>
				<div class="content-title">基于异构图的多级漏洞检测算法与图神经网络算法Buggy-F1对比</div>
			</template>
			<schart class="schart" canvasId="buggy-f1-graph" :options="optionsBuggyF1graph"></schart>
		</el-card>
        <el-card class="mgb20" shadow="hover">
			<template #header>
				<div class="content-title">基于异构图的多级漏洞检测算法与图神经网络算法Macro-F1对比</div>
			</template>
			<schart class="schart" canvasId="macro-f1-graph" :options="optionsMacroF1graph"></schart>
		</el-card> -->
	</div>
</template>

<script setup lang="ts" name="schart">
import Schart from 'vue-schart';

// Buggy-F1 数据对比图表配置
const optionsBuggyF1 = {
	type: 'bar',
	title: {
		text: '基于异构图的多级漏洞检测算法与传统算法比较 (Buggy F1)'
	},
	colorList: ["#3f51b5", "#009688", "#f44336", "#00bcd4", "#1ABC9C", "#FF9800", "#8BC34A", "#795548"],
	labels: ['访问控制漏洞', '算术漏洞', '拒绝服务漏洞', '抢先交易漏洞', '重入漏洞', '时间操作漏洞', '未检查的低级调用漏洞'],
	datasets: [
		{
			label: 'Securify2',
			data: [13.23, 11.25, 18.57, 54.67, 23.18, 24.83, 11.32]
		},
		{
			label: 'smartcheck',
			data: [20.34, 22.89, 15.73, 46.58, 21.92, 44.15, 11.43]
		},
		{
			label: 'ConFuzzius',
			data: [15.87, 10.92, 9.28, 47.13, 26.71, 25.47, 7.29]
		},
		{
			label: 'Conkas',
			data: [19.45, 20.62, 16.73, 45.34, 20.89, 41.05, 10.63]
		},
		{
			label: 'HoneyBadger',
			data: [17.83, 12.68, 12.14, 42.82, 27.94, 26.43, 9.78]
		},
		{
			label: 'Osiris',
			data: [18.29, 24.37, 10.51, 44.36, 24.78, 42.53, 10.47]
		},
		{
			label: 'mythril',
			data: [35.04, 34.73, 17.28, 41.36, 22.13, 26.82, 15.28]
		},
		{
			label: '基于异构图的多级漏洞检测算法',
			data: [81.98, 84.35, 82.09, 90.15, 86.07, 86.47, 84.81]
		}
	]
};

// Macro-F1 数据对比图表配置
const optionsMacroF1 = {
	type: 'bar',
	title: {
		text: '基于异构图的多级漏洞检测算法(Macro F1)'
	},
	colorList: ["#3f51b5", "#009688", "#f44336", "#00bcd4", "#1ABC9C", "#FF9800", "#8BC34A", "#795548"],
	labels: ['访问控制漏洞', '算术漏洞', '拒绝服务漏洞', '抢先交易漏洞', '重入漏洞', '时间操作漏洞', '未检查的低级调用漏洞'],
	datasets: [
		{
			label: 'Securify2',
			data: [51.23, 52.46, 58.29, 71.36, 50.12, 52.41, 54.18]
		},
		{
			label: 'smartcheck',
			data: [56.17, 60.23, 45.39, 60.04, 48.23, 57.36, 52.29]
		},
		{
			label: 'ConFuzzius',
			data: [53.12, 51.07, 52.48, 68.29, 53.54, 55.02, 48.72]
		},
		{
			label: 'Conkas',
			data: [54.39, 62.14, 55.68, 66.38, 51.74, 59.29, 49.08]
		},
		{
			label: 'HoneyBadger',
			data: [55.73, 53.28, 51.47, 63.42, 55.18, 57.15, 47.82]
		},
		{
			label: 'Osiris',
			data: [58.07, 64.52, 54.19, 65.11, 50.43, 58.26, 48.47]
		},
		{
			label: 'mythril',
			data: [61.17, 73.48, 60.17, 77.83, 55.36, 50.81, 55.72]
		},
		{
			label: '基于异构图的多级漏洞检测算法',
			data: [79.23, 79.10, 77.84, 78.60, 80.78, 86.76, 86.74]
		}
	]
};

// Buggy F1 数据对比图表配置
const optionsBuggyF1graph = {
	type: 'bar',
	title: {
		text: '其他图神经网络方法 vs 基于异构图的多级漏洞检测算法 (Buggy F1)'
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
			label: '基于异构图的多级漏洞检测算法',
			data: [89.15, 59.44, 87.71, 89.86, 71.04, 83.86, 73.38]
		}
	]
};

// Macro-F1 数据对比图表配置
const optionsMacroF1graph = {
	type: 'bar',
	title: {
		text: '其他图神经网络方法 vs 基于异构图的多级漏洞检测算法 (Macro-F1)'
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
			label: '基于异构图的多级漏洞检测算法',
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
