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
			<template #scriptName="{ rows }">
				<span>{{ rows.scriptName }}</span>
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
				<el-form-item label="上传脚本">
					<el-upload
						class="upload-demo"
						drag
						action="http://jsonplaceholder.typicode.com/api/posts/"
						multiple
						:on-change="handleUploadChange"
					>
						<el-icon class="el-icon--upload"><upload-filled /></el-icon>
						<div class="el-upload__text">
							将文件拖到此处，或
							<em>点击上传</em>
						</div>
					</el-upload>
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
	{ prop: 'scriptName', label: '策略脚本名称', slot: 'scriptName' },
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
	scriptName: '',
});

// 打开弹窗
const openDialog = (editMode, strategy = null) => {
	isEdit.value = editMode;
	if (editMode && strategy) {
		strategyData.value = { ...strategy };
	} else {
		strategyData.value = { name: '', scriptName: '' };
	}
	visible.value = true;
};

// 保存策略
const saveStrategy = () => {
	if (isEdit.value) {
		const index = tableData.value.findIndex(item => item.id === strategyData.value.id);
		if (index > -1) tableData.value.splice(index, 1, { ...strategyData.value });
	} else {
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

// 处理上传文件变化
const handleUploadChange = (fileList) => {
	if (fileList.length > 0) {
		strategyData.value.scriptName = fileList[0].name; // 显示上传的文件名称
	}
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
