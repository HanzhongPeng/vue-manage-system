<template>
	<div class="tool-config-container">
		<h1 class="page-title">工具配置</h1>

		<!-- 新增工具按钮 -->
		<el-button type="primary" @click="openDialog(false)">新增工具</el-button>

		<!-- 工具列表 -->
		<TableCustom :columns="columns" :tableData="tableData" :currentPage="page.index" :changePage="changePage">
			<template #toolName="{ rows }">
				<span>{{ rows.name }}</span>
			</template>
			<template #toolType="{ rows }">
				<span>{{ rows.type }}</span>
			</template>
			<template #toolStatus="{ rows }">
				<el-switch v-model="rows.status" active-text="启用" inactive-text="停用" @change="handleStatusChange(rows)" />
			</template>
			<template #operator="{ rows }">
				<el-button type="primary" size="small" @click="openDialog(true, rows)">编辑</el-button>
				<el-button type="danger" size="small" @click="handleDelete(rows)">删除</el-button>
			</template>
		</TableCustom>

		<!-- 新增/编辑工具弹窗 -->
		<el-dialog :title="isEdit ? '编辑工具' : '新增工具'" v-model="visible" width="500px" destroy-on-close>
			<el-form :model="toolData" label-width="80px">
				<el-form-item label="工具名称">
					<el-input v-model="toolData.name" placeholder="请输入工具名称" />
				</el-form-item>
				<el-form-item label="工具类型">
					<el-input v-model="toolData.type" placeholder="请输入工具类型" />
				</el-form-item>
				<el-form-item label="版本">
					<el-input v-model="toolData.version" placeholder="请输入版本" />
				</el-form-item>
				<el-form-item label="描述">
					<el-input type="textarea" v-model="toolData.description" placeholder="请输入工具描述" />
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="closeDialog">取消</el-button>
				<el-button type="primary" @click="saveTool">保存</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import TableCustom from '@/components/table-custom.vue';
import { fetchToolData } from '@/api/index';

// 表格列配置
const columns = ref([
	{ type: 'index', label: '序号', width: 55, align: 'center' },
	{ prop: 'name', label: '工具名称', slot: 'toolName' },
	{ prop: 'type', label: '工具类型', slot: 'toolType' },
	{ prop: 'status', label: '状态', slot: 'toolStatus' },
	{ prop: 'operator', label: '操作', width: 180, slot: 'operator' },
]);

// 数据和分页
const tableData = ref([]);
const page = reactive({
	index: 1,
	size: 10,
	total: 0,
});

// 获取工具数据
const getData = async () => {
	try {
		const res = await fetchToolData();
		tableData.value = res.data.list;
		page.total = res.data.pageTotal;
	} catch (error) {
		console.error("获取工具数据失败：", error);
	}
};
onMounted(() => getData());

// 分页切换
const changePage = (pageIndex) => {
	page.index = pageIndex;
	getData();
};

// 弹窗控制和工具数据
const visible = ref(false);
const isEdit = ref(false);
const toolData = ref({
	name: '',
	type: '',
	version: '',
	description: '',
	status: false,
});

// 打开弹窗
const openDialog = (editMode, tool = null) => {
	isEdit.value = editMode;
	if (editMode && tool) {
		toolData.value = { ...tool };
	} else {
		toolData.value = { name: '', type: '', version: '', description: '', status: false };
	}
	visible.value = true;
};

// 保存工具
const saveTool = () => {
	if (isEdit.value) {
		// 编辑模式：更新工具信息
		const index = tableData.value.findIndex(item => item.id === toolData.value.id);
		if (index > -1) tableData.value.splice(index, 1, { ...toolData.value });
	} else {
		// 新增模式：添加新工具
		tableData.value.push({
			...toolData.value,
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

// 删除工具
const handleDelete = (tool) => {
	tableData.value = tableData.value.filter(item => item.id !== tool.id);
};

// 状态切换
const handleStatusChange = (tool) => {
	console.log(`${tool.name} 的状态已更改为 ${tool.status ? '启用' : '停用'}`);
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
