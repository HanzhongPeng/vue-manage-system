<template>
	<div class="tool-config-container">
		<h1 class="page-title">工具信息展示</h1>

		<!-- 工具列表 -->
		<TableCustom :columns="columns" :tableData="tableData" :currentPage="page.index" :changePage="changePage">
			<template #toolName="{ rows }">
				<span>{{ rows.name }}</span>
			</template>
			<template #toolDescription="{ rows }">
				<span>{{ rows.description }}</span>
			</template>
			<template #toolSource="{ rows }">
				<a :href="rows.sourceLink" target="_blank">查看源码</a>
			</template>
		</TableCustom>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import TableCustom from '@/components/table-custom.vue';

// 表格列配置
const columns = ref([
	{ type: 'index', label: '序号', width: 55, align: 'center' },
	{ prop: 'name', label: '工具名称', slot: 'toolName' },
	{ prop: 'description', label: '工具简介', slot: 'toolDescription' },
	{ prop: 'sourceLink', label: '源码链接', slot: 'toolSource' },
]);

// 静态工具数据
const tableData = ref([
	{
		id: 1,
		name: 'Securify2',
		description: '智能合约形式化验证工具，支持CLI或API服务，用户可通过参数指定合约文件路径及分析选项，支持配置文件自定义分析行为。',
		sourceLink: 'https://github.com/eth-sri/securify2',
	},
	{
		id: 2,
		name: 'smartcheck',
		description: '可扩展的静态分析工具，将Solidity代码转化为XML中间表示形式，并利用XPath模式进行对比检查。',
		sourceLink: 'https://github.com/smartdec/smartcheck',
	},
	{
		id: 3,
		name: 'ConFuzzius',
		description: '基于模糊测试的分析工具，通过创建随机输入数据来测试智能合约。',
		sourceLink: 'https://github.com/christoftorres/ConFuzzius',
	},
	{
		id: 4,
		name: 'Conkas',
		description: '基于符号执行的以太坊虚拟机模块化静态分析工具，能够分析Solidity智能合约或编译的字节码，使用Z3作为SMT求解器。',
		sourceLink: 'https://github.com/smartbugs/conkas',
	},
	{
		id: 5,
		name: 'HoneyBadger',
		description: '符号执行工具，通过大规模分析智能合约，高效检测以太坊智能合约中的蜜罐合约。',
		sourceLink: 'https://github.com/christoftorres/HoneyBadger',
	},
	{
		id: 6,
		name: 'Osiris',
		description: '结合符号执行与污点分析，专注于合约整数漏洞，针对算术、截断及符号错误，使用启发式规则识别良性的整数错误。',
		sourceLink: 'https://github.com/christoftorres/Osiris',
	},
	{
		id: 7,
		name: 'mythril',
		description: 'EVM 字节码的安全分析工具，检测以太坊和其他兼容EVM的区块链合约，使用符号执行、SMT求解和污点分析来检测安全漏洞。',
		sourceLink: 'https://github.com/ConsenSys/mythril',
	},
]);


// 分页配置
const page = reactive({
	index: 1,
	size: 10,
	total: tableData.value.length,
});

// 分页切换
const changePage = (pageIndex) => {
	page.index = pageIndex;
};
</script>

<style scoped>
.tool-config-container {
	padding: 20px;
}
.page-title {
	font-size: 24px;
	margin-bottom: 20px;
}
</style>
