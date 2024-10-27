<template>
	<div class="strategy-config-container">
		<h1 class="page-title">策略配置</h1>

		<!-- 新增策略按钮 -->
		<el-button type="primary" @click="openDialog(false)">新增策略</el-button>

		<!-- 策略列表 -->
		<TableCustom :columns="columns" :tableData="tableData" :currentPage="page.index" :changePage="changePage">
			<template #strategyName="{ rows }">
				<span>{{ rows.name }}</span>
			</template>
			<template #strategyType="{ rows }">
				<span>{{ rows.type }}</span>
			</template>
			<template #strategyStatus="{ rows }">
				<el-switch v-model="rows.status" active-text="启用" inactive-text="停用" @change="handleStatusChange(rows)" />
			</template>
			<template #operator="{ rows }">
				<el-button type="primary" size="small" @click="openDialog(true, rows)">编辑</el-button>
				<el-button type="danger" size="small" @click="handleDelete(rows)">删除</el-button>
			</template>
		</TableCustom>

		<!-- 新增/编辑策略弹窗 -->
		<el-dialog :title="isEdit ? '编辑策略' : '新增策略'" v-model="visible" width="500px" destroy-on-close>
			<el-form :model="strategyData" label-width="80px">
				<el-form-item label="策略名称">
					<el-input v-model="strategyData.name" placeholder="请输入策略名称" />
				</el-form-item>
				<el-form-item label="策略类型">
					<el-input v-model="strategyData.type" placeholder="请输入策略类型" />
				</el-form-item>
				<el-form-item label="版本">
					<el-input v-model="strategyData.version" placeholder="请输入版本" />
				</el-form-item>
				<el-form-item label="描述">
					<el-input type="textarea" v-model="strategyData.description" placeholder="请输入策略描述" />
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="closeDialog">取消</el-button>
				<el-button type="primary" @click="saveStrategy">保存</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import TableCustom from '@/components/table-custom.vue';
import { fetchStrategyData } from '@/api/index';

// 表格列配置
const columns = ref([
	{ type: 'index', label: '序号', width: 55, align: 'center' },
	{ prop: 'name', label: '策略名称', slot: 'strategyName' },
	{ prop: 'type', label: '策略类型', slot: 'strategyType' },
	{ prop: 'status', label: '状态', slot: 'strategyStatus' },
	{ prop: 'operator', label: '操作', width: 180, slot: 'operator' },
]);

// 数据和分页
const tableData = ref([]);
const page = reactive({
	index: 1,
	size: 10,
	total: 0,
});

// 获取策略数据
const getData = async () => {
	try {
		const res = await fetchStrategyData();
		tableData.value = res.data.list;
		page.total = res.data.pageTotal;
	} catch (error) {
		console.error("获取策略数据失败：", error);
	}
};
onMounted(() => getData());

// 分页切换
const changePage = (pageIndex) => {
	page.index = pageIndex;
	getData();
};

// 弹窗控制和策略数据
const visible = ref(false);
const isEdit = ref(false);
const strategyData = ref({
	name: '',
	type: '',
	version: '',
	description: '',
	status: false,
});

// 打开弹窗
const openDialog = (editMode, strategy = null) => {
	isEdit.value = editMode;
	if (editMode && strategy) {
		strategyData.value = { ...strategy };
	} else {
		strategyData.value = { name: '', type: '', version: '', description: '', status: false };
	}
	visible.value = true;
};

// 保存策略
const saveStrategy = () => {
	if (isEdit.value) {
		// 编辑模式：更新策略信息
		const index = tableData.value.findIndex(item => item.id === strategyData.value.id);
		if (index > -1) tableData.value.splice(index, 1, { ...strategyData.value });
	} else {
		// 新增模式：添加新策略
		tableData.value.push({
			...strategyData.value,
			id: tableData.value.length + 1, // 模拟生成ID
			createdAt: new Date().toISOString(),
		});
	}
	closeDialog();
	getData();
};

// 关闭弹窗
const closeDialog = () => {
	visible.value = false;
	isEdit.value = false;
};

// 删除策略
const handleDelete = (strategy) => {
	tableData.value = tableData.value.filter(item => item.id !== strategy.id);
};

// 状态切换
const handleStatusChange = (strategy) => {
	console.log(`${strategy.name} 的状态已更改为 ${strategy.status ? '启用' : '停用'}`);
};
</script>

<style scoped>
.project-container {
	padding: 20px;
}
.page-title {
	font-size: 24px;
	margin-bottom: 20px;
}
.dialog-footer {
	display: flex;
	justify-content: flex-end;
	padding: 10px 0;
}
</style>
