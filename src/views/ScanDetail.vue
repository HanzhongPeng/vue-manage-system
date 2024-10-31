<template>
	<div class="scan-detail-container">
		<h2>扫描详情 - 文件名: {{ fileName }}</h2>

		<!-- 漏洞概要信息 -->
		<el-card class="summary-card" shadow="hover">
			<el-descriptions title="漏洞总结" :column="2" border>
				<el-descriptions-item label="总漏洞数">{{ totalVulnerabilities }}</el-descriptions-item>
				<el-descriptions-item label="检测策略">{{ selectedStrategy }}</el-descriptions-item>
				<el-descriptions-item label="扫描时间">{{ scanDate }}</el-descriptions-item>
			</el-descriptions>
		</el-card>

		<!-- 漏洞详情表格 -->
		<div class="section">
			<h3>漏洞详细信息</h3>
			<el-table :data="vulnerabilityDetails" style="width: 100%">
				<el-table-column prop="contract" label="合约名称" width="200" />
				<el-table-column prop="type" label="漏洞类型" />
				<el-table-column prop="count" label="漏洞数量" width="150" />
			</el-table>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

// 获取路由参数
const route = useRoute();
const fileName = route.params.fileName;

// Mock数据：漏洞信息
const vulnerabilityDetails = ref([
	{ contract: 'timed_crowdsale.sol', type: '过时的编译器版本', count: 1 },
	{ contract: 'timed_crowdsale.sol', type: 'Usage of block timestamp', count: 1 },
	{ contract: 'governmental_survey.sol', type: '过时的编译器版本', count: 2 },
	{ contract: 'governmental_survey.sol', type: 'require()函数冲突', count: 1 },
	{ contract: 'governmental_survey.sol', type: '未检查的外部调用', count: 1 },
	{ contract: 'governmental_survey.sol', type: '函数默认可见性', count: 1 },
	{ contract: 'roulette.sol', type: 'Block 值作为时间的代理', count: 3 },
	{ contract: 'roulette.sol', type: '事务顺序依赖性', count: 1 },
	{ contract: 'roulette.sol', type: '无保护的以太币提款', count: 1 },
	{ contract: 'roulette.sol', type: '以太币/代币锁定', count: 1 },
	{ contract: 'roulette.sol', type: '过时的编译器版本', count: 1 },
	{ contract: 'roulette.sol', type: '使用已弃用的 Solidity 函数', count: 1 },
	{ contract: 'ether_lotto.sol', type: '断言冲突', count: 1 },
	{ contract: 'ether_lotto.sol', type: 'Block 值作为时间的代理', count: 1 },
	{ contract: 'ether_lotto.sol', type: 'DoS导致的调用失败', count: 1 },
	{ contract: 'ether_lotto.sol', type: '事务顺序依赖性', count: 1 },
	{ contract: 'ether_lotto.sol', type: '过时的编译器版本', count: 2 },
	{ contract: 'ether_lotto.sol', type: '未初始化的变量', count: 1 },
	{ contract: 'ether_lotto.sol', type: '函数默认可见性', count: 1 },
	{ contract: 'ether_lotto.sol', type: '资金流动漏洞', count: 1 },
]);

// Mock数据：漏洞概要信息
const selectedStrategy = '全面策略-Securify2、smartcheck、mythril';
const scanDate = '2024-10-01';

// 计算总漏洞数
const totalVulnerabilities = computed(() =>
	vulnerabilityDetails.value.reduce((sum, item) => sum + item.count, 0)
);
</script>

<style scoped>
.scan-detail-container {
	padding: 20px;
}
.summary-card {
	margin-bottom: 20px;
	padding: 20px;
}
.section {
	margin-top: 20px;
}
</style>
