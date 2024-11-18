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

// // 路由跳转方法 - 用于跳转到项目详情页面
// const navigateToProject = (id) => {
// 	router.push({ name: 'projectDetail', params: { id } });
// };

// 路由跳转方法 - 用于跳转到项目详情页面
const navigateToProject = (projectId) => {
  router.push({ name: 'projectDetail', params: { id: projectId } });
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

// // 获取项目数据并更新表格
// const getData = async () => {
// 	try {
// 		const res = await fetchProjectData();
// 		tableData.value = res.data.list;
// 		page.total = res.data.pageTotal;
// 	} catch (error) {
// 		console.error("获取数据失败：", error);
// 	}
// };
// onMounted(() => getData());

// 获取项目数据并更新表格
// 获取项目数据并更新表格
// 获取项目数据并更新表格
const getData = async () => {
  try {
    const response = await request({
      url: `http://26.142.76.59:8080/api/projects`,
      method: 'GET'
    });

    // 检查响应数据是否成功
    if (response && response.status === 200 && Array.isArray(response.data)) {
      // 映射数据到表格
      tableData.value = response.data.map(project => ({
        id: project.id, // 序号
        projectName: project.name, // 项目名称
        createdAt: formatDate(project.created_at) // 格式化创建时间
      }));
      // 更新总项目数
      page.total = tableData.value.length;
    } else {
      console.error("获取项目列表失败，数据格式不正确");
    }
  } catch (error) {
    console.error("获取项目数据失败：", error);
  }
};

// 格式化创建时间
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString(); // 使用本地时间格式显示
};


// // 时间格式化函数
// const formatDate = (isoString) => {
//   const date = new Date(isoString);
//   return date.toLocaleString(); // 使用本地格式化
// };

onMounted(() => getData());


// 分页切换
const changePage = (pageIndex) => {
	page.index = pageIndex;
	getData();
};

// 控制弹窗的显示和编辑状态
const visible = ref(false);
const isEdit = ref(false);

// 打开编辑/新增项目弹窗
const openDialog = (editMode, row = null) => {
  isEdit.value = editMode;
  if (editMode && row) {
    // 复制项目数据到 rowData，以便在弹窗中显示和编辑
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
			url: 'http://26.142.76.59:8080/api/auth/login', // 认证接口 URL
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
// 保存项目
const saveProject = async () => {
  const projectData = {
    id: rowData.value.id || 0,
    name: rowData.value.projectName,
    created_at: rowData.value.createdAt || new Date().toISOString(),
    editable: true,
    filepath: "./"
  };

  try {
    if (isEdit.value) {
      // 编辑项目
      const response = await request({
        url: `http://26.142.76.59:8080/api/projects/${projectData.id}`,
        method: 'PUT',
        data: projectData
      });

      if (response && response.status === 200) {
        // 更新 tableData 中的项目数据
        const updatedProject = response.data;
        const index = tableData.value.findIndex(item => item.id === updatedProject.id);
        if (index !== -1) {
          tableData.value[index] = {
            id: updatedProject.id,
            projectName: updatedProject.name,
            createdAt: updatedProject.created_at
          };
        }
      }
    } else {
      // 新增项目
      const newProject = {
        created_at: new Date().toISOString(),
        name: rowData.value.projectName
      };

      const response = await request({
        url: 'http://26.142.76.59:8080/api/projects',
        method: 'POST',
        data: newProject
      });

      if (response) {
        tableData.value.push(response.data);
      }
    }
    closeDialog();
    getData();
  } catch (error) {
    console.error(isEdit.value ? '编辑项目失败:' : '新增项目失败:', error);
  }
};




// 关闭弹窗
const closeDialog = () => {
	visible.value = false;
	isEdit.value = false;
	rowData.value = {};
};


// // 删除项目
const handleDelete = async (row) => {
  try {
    const response = await request({
      url: `http://26.142.76.59:8080/api/projects/${row.id}`,
      method: 'DELETE'
    });

    // 检查删除是否成功
    if (response && response.status === 200) {
      // 从 tableData 中移除被删除的项目
      tableData.value = tableData.value.filter(item => item.id !== row.id);
      console.log(`项目 ID ${row.id} 删除成功`);
    }
  } catch (error) {
    console.error(`删除项目 ID ${row.id} 失败:`, error);
  }
};
// 删除项目
// const handleDelete = (row) => {
// 	tableData.value = tableData.value.filter((item) => item.id !== row.id);
// };
// </script>



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
