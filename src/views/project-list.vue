<template>
	<div>
		<!-- 新建项目按钮 -->
		<el-button type="primary" @click="openDialog(false)">新增项目</el-button>

		<!-- 项目列表 -->
		<TableCustom :columns="columns" :tableData="tableData" :currentPage="page.index" :changePage="changePage">
			<template #projectName="{ rows }">
				<span class="project-link" @click="navigateToProject(rows.id)">
					{{ rows.projectName }}
				</span>
			</template>
			<template #createdAt="{ rows }">
				{{ rows.createdAt }}
			</template>
			<template #operator="{ rows }">
				<el-button type="primary" size="small" @click="openDialog(true, rows)">编辑</el-button>
				<el-button type="danger" size="small" @click="handleDelete(rows)">删除</el-button>
			</template>
		</TableCustom>

		<!-- 新建/编辑项目弹窗 -->
		<el-dialog :title="isEdit ? '编辑项目' : '新增项目'" v-model="visible" width="500px" destroy-on-close>
			<el-form :model="rowData" label-width="80px">
				<el-form-item label="项目名称">
					<el-input v-model="rowData.projectName" placeholder="请输入项目名称"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="closeDialog">取消</el-button>
				<el-button type="primary" @click="saveProject">保存</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import TableCustom from '@/components/table-custom.vue';
import { fetchProjectData } from '@/api/index';

const router = useRouter();

// 路由跳转方法 - 用于跳转到项目详情页面
const navigateToProject = (id) => {
	router.push({ name: 'projectDetail', params: { id } });
};

// 表格列配置
const columns = ref([
	{ type: 'index', label: '序号', width: 55, align: 'center' },
	{ prop: 'projectName', label: '项目名称', slot: 'projectName' },
	{ prop: 'createdAt', label: '创建时间', slot: 'createdAt' },
	{ prop: 'operator', label: '操作', width: 180, slot: 'operator' },
]);



const tableData = ref([]);
const rowData = ref({});
const page = reactive({
	index: 1,
	size: 10,
	total: 0,
});

// 获取项目数据并更新表格
const getData = async () => {
	try {
		const res = await fetchProjectData();
		tableData.value = res.data.list;
		page.total = res.data.pageTotal;
	} catch (error) {
		console.error("获取数据失败：", error);
	}
};
onMounted(() => getData());

// 分页切换
const changePage = (pageIndex) => {
	page.index = pageIndex;
	getData();
};

// 控制弹窗的显示和编辑状态
const visible = ref(false);
const isEdit = ref(false);

const openDialog = (editMode, row = null) => {
	isEdit.value = editMode;
	if (editMode && row) {
		rowData.value = { ...row };
	} else {
		rowData.value = { projectName: '' }; // 清空表单数据
	}
	visible.value = true;
};

// // 保存项目
// const saveProject = () => {
// 	if (!isEdit.value) {
// 		// 新增项目
// 		tableData.value.push({
// 			...rowData.value,
// 			id: tableData.value.length + 1,
// 			createdAt: new Date().toISOString()
// 		});
// 	}
// 	closeDialog();
// 	getData();
// };

import request from '../utils/request';

// 认证请求
const authenticate = async () => {
	const credentials = {
		username: 'test', // 用户名
		password: 'test'  // 密码
	};

	try {
		const response = await request({
			url: 'http://localhost:8080/api/auth/login', // 认证接口 URL
			method: 'POST',
			data: credentials
		});
		if (response) {
			console.log('Authentication successful:', response.data);
			// 处理认证成功后的逻辑，例如保存 token 等
		}
	} catch (error) {
		console.error('Authentication failed:', error);
	}
};

// 调用认证函数
authenticate();

// 保存项目
const saveProject = async () => {
    // console.log(rowData.value.projectName)
	if (!isEdit.value) {
		// 新增项目
		const newProject = {
			created_at: new Date().toISOString(), // 只保留创建时间
			name: rowData.value.projectName // 项目名称
		};

		try {
			const response = await request({
				url: 'http://localhost:8080/api/projects', // 使用提供的接口 URL
				method: 'POST',
				data: newProject
			});
			if (response) {
				// 更新 tableData 或其他状态
				tableData.value.push(response.data); // 假设响应包含新项目数据
			}
		} catch (error) {
			console.error('Error creating project:', error);
		}
	}
	closeDialog();
	getData();
};



// 关闭弹窗
const closeDialog = () => {
	visible.value = false;
	isEdit.value = false;
	rowData.value = {};
};

// 删除项目
const handleDelete = (row) => {
	tableData.value = tableData.value.filter((item) => item.id !== row.id);
};
</script>

<style scoped>
.project-link {
	color: blue;
	cursor: pointer;
	text-decoration: underline;
}
.dialog-footer {
	display: flex;
	justify-content: flex-end;
	padding: 10px 0;
}
</style>
