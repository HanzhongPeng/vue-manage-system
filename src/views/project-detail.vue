<template>
	<div class="project-container">
		<h1 class="project-title">{{ projectInfo.projectName }}</h1>

		<el-card class="project-details-card" shadow="hover">
			<el-descriptions title="项目详情" :column="2" border>
				<el-descriptions-item label="创建时间">{{ formattedCreatedAt }}</el-descriptions-item>
			</el-descriptions>
		</el-card>

		<!-- 上传代码文件 -->
		<div class="section">
			<h3>上传代码文件</h3>
			<el-upload
				class="upload-demo"
				drag
				:action="uploadUrl"
				:headers="headers"
				multiple
				:on-success="handleUploadSuccess"
				:on-error="handleUploadError"
				:data="uploadData"
			>
				<el-icon><upload-filled /></el-icon>
				<div class="el-upload__text">
					将文件拖到此处，或 <em>点击上传</em>
				</div>
			</el-upload>
		</div>

		<!-- 检测策略选择 -->
		<el-form label-width="120px" class="selection-form">
			<el-form-item label="检测策略">
				<el-select v-model="selectedStrategyId" placeholder="请选择检测策略">
					<el-option v-for="strategy in strategies" :key="strategy.id" :label="strategy.name" :value="strategy.id" />
				</el-select>
			</el-form-item>
		</el-form>

		<!-- 操作按钮 -->
		<div class="buttons">
			<el-button type="primary" @click="startScan">开始扫描</el-button>
			<el-button type="success" @click="exportReport">导出报告</el-button>
		</div>

		<!-- 扫描结果 -->
		<div class="section">
			<h3>扫描结果</h3>
			<el-table :data="scanHistory" style="width: 100%">
				<el-table-column prop="fileName" label="代码文件名称" />
				<el-table-column prop="strategy" label="策略" />
				<el-table-column prop="date" label="扫描时间" width="180" />
				<el-table-column prop="vulnerabilities" label="漏洞数量" width="150" />
				<el-table-column label="操作" width="120">
					<template #default="{ row }">
						<el-button type="text" @click="viewScanDetails(row)">查看详情</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import request from '@/utils/request';

// 路由参数和项目信息
const route = useRoute();
const projectId = route.params.id;

const projectInfo = ref({
	projectName: '',
	createdAt: '',
});

// 格式化后的创建时间
const formattedCreatedAt = ref('');

// 获取项目数据
const getProjectData = async () => {
	try {
		const response = await request({
			url: `http://localhost:8080/api/projects/${projectId}`,
			method: 'GET'
		});
		if (response && response.status === 200) {
			const project = response.data;
			projectInfo.value = {
				projectName: project.name,
				createdAt: project.created_at,
			};
			formattedCreatedAt.value = new Date(project.created_at).toLocaleString();
		} else {
			ElMessage.error("项目不存在");
		}
	} catch (error) {
		console.error("获取项目数据失败：", error);
		ElMessage.error("获取项目数据失败");
	}
};

// 获取策略列表
const strategies = ref([]);
const getStrategies = async () => {
	try {
		const response = await request({
			url: 'http://localhost:8080/api/strategies',
			method: 'GET'
		});
		if (response && response.status === 200) {
			// 将策略列表保存到 strategies
			strategies.value = response.data.map(strategy => ({
				id: strategy.id,
				name: strategy.name
			}));
		} else {
			ElMessage.error("获取策略列表失败");
		}
	} catch (error) {
		console.error("获取策略列表失败：", error);
		ElMessage.error("获取策略列表失败");
	}
};

// 上传文件接口的URL和参数
const uploadUrl = `http://localhost:8080/api/projects/${projectId}/upload`;
const headers = { /* 在此配置需要的headers */ };
const uploadData = { id: projectId };

// 上传成功和失败的处理
const handleUploadSuccess = () => {
	ElMessage.success("文件上传成功");
};

const handleUploadError = (error) => {
	console.error("文件上传失败：", error);
	ElMessage.error("文件上传失败");
};

// 检测策略选择
const selectedStrategyId = ref(''); // 存储选择的策略ID

// 操作按钮事件
const startScan = () => {
	if (!selectedStrategyId.value) {
		ElMessage.error('请先选择检测策略');
		return;
	}
	console.log('开始扫描，使用策略 ID:', selectedStrategyId.value);
	// 在这里添加调用开始扫描的接口
};

const exportReport = () => {
	ElMessage.success('报告已导出');
};

// 扫描结果
const scanHistory = ref([
	{ fileName: 'main.py', strategy: '策略 X', date: '2024-10-01', vulnerabilities: 5 },
	{ fileName: 'module1.js', strategy: '策略 Y', date: '2024-10-02', vulnerabilities: 2 },
	{ fileName: 'app.java', strategy: '策略 Z', date: '2024-10-03', vulnerabilities: 1 },
]);

// 查看扫描详情
const viewScanDetails = (row) => {
	console.log('查看扫描详情:', row);
};

// 初始化时获取项目和策略数据
onMounted(() => {
	getProjectData();
	getStrategies();
});
</script>

<style scoped>
.project-container {
	padding: 20px;
}
.project-title {
	font-size: 28px;
	font-weight: bold;
	margin-bottom: 20px;
}
.project-details-card {
	margin-top: 20px;
	padding: 20px;
}
.section {
	margin-top: 20px;
}
.buttons {
	margin-top: 20px;
	display: flex;
	justify-content: flex-end;
	gap: 10px;
}
</style>
