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
				<span>{{ rows.script }}</span>
			</template>
			<template #createdAt="{ rows }">
				<span>{{ rows.createdAt }}</span>
			</template>
			<template #operator="{ rows }">
				<el-button type="primary" size="small" @click="openDialog(true, rows)">编辑</el-button>
				<el-button type="danger" size="small" @click="handleDelete(rows)">删除</el-button>
				<el-button type="success" size="small" @click="openUploadDialog(rows)">上传脚本</el-button>
			</template>
		</TableCustom>

		<!-- 新建/编辑策略弹窗 -->
		<el-dialog :title="isEdit ? '编辑策略' : '新增策略'" v-model="visible" width="500px" destroy-on-close>
			<el-form :model="strategyData" label-width="80px">
				<el-form-item label="策略名称">
					<el-input v-model="strategyData.name" placeholder="请输入策略名称" />
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="closeDialog">取消</el-button>
				<el-button type="primary" @click="saveStrategy">保存</el-button>
			</div>
		</el-dialog>

		<el-dialog title="上传脚本" v-model="uploadVisible" width="500px" destroy-on-close>
			<el-upload
				class="upload-demo"
				:action="uploadUrl"  
				:http-request="customUploadRequest" 
				drag
			>
				<el-icon class="el-icon--upload"><upload-filled /></el-icon>
				<div class="el-upload__text">
					将文件拖到此处，或 <em>点击上传</em>
				</div>
			</el-upload>

			<div slot="footer" class="dialog-footer">
				<el-button @click="closeUploadDialog">取消</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import TableCustom from '@/components/table-custom.vue';
import request from '@/utils/request';
import { ElMessage } from 'element-plus';

// 表格列配置
const columns = ref([
	{ type: 'index', label: '序号', width: 55, align: 'center' },
	{ prop: 'name', label: '策略名称', slot: 'strategyName' },
	{ prop: 'script', label: '策略脚本名称', slot: 'scriptName' },
	{ prop: 'createdAt', label: '创建时间', slot: 'createdAt' },
	{ prop: 'operator', label: '操作', width: 300, slot: 'operator' },
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
		const res = await request({
			url: 'http://26.142.76.59:8080/api/strategies',
			method: 'GET',
		});
		if (res && res.status === 200 && Array.isArray(res.data)) {
			tableData.value = res.data.map(strategy => ({
				id: strategy.id,
				name: strategy.name,
				script: strategy.script,
				createdAt: formatDate(strategy.created_at),
			}));
			page.total = tableData.value.length;
		} else {
			console.error("获取策略列表失败，数据格式不正确");
		}
	} catch (error) {
		console.error("获取策略数据失败：", error);
	}
};
onMounted(() => getData());

// 格式化创建时间
const formatDate = (dateString) => {
	const date = new Date(dateString);
	return isNaN(date.getTime()) ? dateString : date.toLocaleString();
};

// 分页切换
const changePage = (pageIndex) => {
	page.index = pageIndex;
	getData();
};

// 弹窗控制和策略数据
const visible = ref(false);
const uploadVisible = ref(false);
const isEdit = ref(false);
const strategyData = ref({
	id: 0,
	name: '',
	script: 'default',
	createdAt: '',
});
const currentStrategyId = ref(null); // 用于存储当前上传脚本的策略ID

// 打开编辑/新增策略弹窗
const openDialog = (editMode, strategy = null) => {
	isEdit.value = editMode;
	if (editMode && strategy) {
		strategyData.value = { ...strategy };
	} else {
		strategyData.value = { name: '', script: 'default', id: 0 };
	}
	visible.value = true;
};
// 修改后的 createStrategy
const createStrategy = async () => {
    try {
        const response = await request({
            url: 'http://26.142.76.59:8080/api/strategies',
            method: 'POST',
            data: {
                name: strategyData.value.name,
                script: 'default',
                created_at: new Date().toISOString(),
            },
        });

        console.log("创建策略响应:", response); // 检查返回的 response 对象

        if (response?.data?.id) {
            ElMessage.success('新增策略成功');
            await getData();
            closeDialog();
        } else {
            ElMessage.success('新增策略成功');
			await getData();
            closeDialog();
        }
    } catch (error) {
        console.error("新增策略失败：", error.response ? error.response.data : error.message);
        ElMessage.error("新增策略失败");
    }
};


const updateStrategy = async () => {
    try {
        // 获取当前策略的完整信息，以确保创建时间保持不变
        const currentStrategy = tableData.value.find(item => item.id === strategyData.value.id);

        const response = await request({
            url: `http://26.142.76.59:8080/api/strategies/${strategyData.value.id}`,
            method: 'PUT',
            data: {
                id: strategyData.value.id,
                name: strategyData.value.name, // 更新名称
                script: strategyData.value.script, // 保持 script 字段不变
                created_at: currentStrategy?.createdAt || strategyData.value.createdAt // 保持创建时间不变
            },
        });

        if (response && response.status === 200) {
            ElMessage.success('编辑策略成功');
            await getData(); // 刷新策略列表
            closeDialog(); // 确保弹窗关闭
        } else {
            ElMessage.error('编辑策略失败');
        }
    } catch (error) {
        console.error("编辑策略失败：", error.response ? error.response.data : error.message);
        ElMessage.error("编辑策略失败");
    }
};


// 在 closeDialog 中重置 visible 状态，确保每次操作后都执行
const closeDialog = () => {
    visible.value = false;
    isEdit.value = false;
    strategyData.value = { id: 0, name: '', script: 'default', createdAt: '' }; // 重置表单数据
};

const saveStrategy = async () => {
    try {
        if (isEdit.value) {
            await updateStrategy();
        } else {
            await createStrategy();
        }
    } finally {
        closeDialog(); // 确保无论操作成功或失败，最终关闭弹窗
    }
};


// 上传相关
const uploadUrl = ref('');
const uploadData = reactive({
    id: null,
});

const openUploadDialog = (strategy) => {
    currentStrategyId.value = strategy.id;
    uploadUrl.value = `http://26.142.76.59:8080/api/strategies/${currentStrategyId.value}/upload`;
    uploadData.id = currentStrategyId.value;
    uploadVisible.value = true;
};

// 自定义上传逻辑
const customUploadRequest = async ({ file, onSuccess, onError }) => {
    const formData = new FormData();
    formData.append("script", file); // 使用自定义文件字段名 `script`
    formData.append("id", currentStrategyId.value);

    try {
        // 第一步：上传文件
        const response = await request({
            url: uploadUrl.value,
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            data: formData,
        });

        if (response && response.status === 200) {
            const uploadedFileName = file.name; // 获取文件名
            ElMessage.success("脚本上传成功");

            // 第二步：调用更新接口更新 script 字段
            await updateStrategyScript(uploadedFileName);

            onSuccess(response.data); // 通知上传成功
            await getData(); // 刷新策略列表
            closeUploadDialog(); // 关闭上传弹窗
        } else {
            ElMessage.error("脚本上传失败");
            onError(new Error("上传失败"));
        }
    } catch (error) {
        console.error("脚本上传失败：", error);
        ElMessage.error("脚本上传失败");
        onError(error); // 通知上传失败
    }
};


const updateStrategyScript = async (fileName) => {
    try {
        // 获取当前策略的名称和创建时间
        const currentStrategy = tableData.value.find(item => item.id === currentStrategyId.value);

        const response = await request({
            url: `http://26.142.76.59:8080/api/strategies/${currentStrategyId.value}`,
            method: 'PUT',
            data: {
                id: currentStrategyId.value,
                name: currentStrategy?.name || strategyData.value.name, // 保持名称不变
                script: fileName, // 更新 script 字段为上传的文件名
                created_at: currentStrategy?.createdAt || strategyData.value.createdAt // 保持创建时间不变
            },
        });

        if (response && response.status === 200) {
            ElMessage.success("策略信息更新成功");
        } else {
            ElMessage.error("更新策略信息失败");
        }
    } catch (error) {
        console.error("更新策略信息失败：", error);
        ElMessage.error("更新策略信息失败");
    }
};



// 关闭上传弹窗
const closeUploadDialog = () => {
    uploadVisible.value = false;
};




const handleUploadSuccess = async (response, file) => {
	try {
		await request({
			url: `http://26.142.76.59:8080/api/strategies/${currentStrategyId.value}`,
			method: 'PUT',
			data: {
				script: file.name,
			},
		});
		ElMessage.success("脚本上传成功并更新策略");
		await getData(); // 重新获取策略列表
		closeUploadDialog();
	} catch (error) {
		console.error("更新策略脚本失败：", error);
		ElMessage.error("更新策略脚本失败");
	}
};


const handleUploadError = (error) => {
	console.error("文件上传失败：", error);
	ElMessage.error("文件上传失败");
};

// // 关闭弹窗
// const closeDialog = () => {
// 	visible.value = false;
// 	isEdit.value = false;
// };

// const closeUploadDialog = () => {
// 	uploadVisible.value = false;
// };

// 删除策略
const handleDelete = async (strategy) => {
	try {
		const response = await request({
			url: `http://26.142.76.59:8080/api/strategies/${strategy.id}`,
			method: 'DELETE',
		});
		if (response && response.status === 200) {
			tableData.value = tableData.value.filter(item => item.id !== strategy.id);
			ElMessage.success(`策略 ${strategy.name} 删除成功`);
		}
	} catch (error) {
		console.error(`删除策略 ID ${strategy.id} 失败:`, error);
	}
};
</script>

<style scoped>
.strategy-config-container {
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
