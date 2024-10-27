<template>
	<div class="project-container">
		<!-- 项目名称显示在页面左上角 -->
		<h1 class="project-title">{{ projectInfo.projectName }}</h1>

		<el-card class="project-details-card" shadow="hover">
			<el-descriptions title="项目详情" :column="2" border>
				<el-descriptions-item label="创建时间">{{ projectInfo.createdAt }}</el-descriptions-item>
				<el-descriptions-item label="负责人">{{ projectInfo.owner }}</el-descriptions-item>
				<el-descriptions-item label="状态">{{ projectInfo.status }}</el-descriptions-item>
				<el-descriptions-item label="描述">{{ projectInfo.description }}</el-descriptions-item>
			</el-descriptions>
		</el-card>

		<!-- 上传代码文件 -->
		<div class="section">
			<h3>上传代码文件</h3>
			<el-upload
				class="upload-demo"
				drag
				action="http://jsonplaceholder.typicode.com/api/posts/"
				multiple
				:on-change="handleFileChange"
			>
				<el-icon><upload-filled /></el-icon>
				<div class="el-upload__text">
					将文件拖到此处，或 <em>点击上传</em>
				</div>
			</el-upload>
		</div>

		<!-- 检测工具和策略选择 -->
		<el-form label-width="120px" class="selection-form">
			<el-form-item label="检测工具">
				<el-select v-model="selectedTool" placeholder="请选择检测工具">
					<el-option v-for="tool in tools" :key="tool.value" :label="tool.label" :value="tool.value" />
				</el-select>
			</el-form-item>
			<el-form-item label="检测策略">
				<el-select v-model="selectedStrategy" placeholder="请选择检测策略">
					<el-option v-for="strategy in strategies" :key="strategy.value" :label="strategy.label" :value="strategy.value" />
				</el-select>
			</el-form-item>
		</el-form>

		<!-- 操作按钮 -->
		<div class="buttons">
			<el-button type="primary" @click="startScan">开始扫描</el-button>
			<el-button type="success" @click="exportReport">导出报告</el-button>
		</div>

		<!-- 历史扫描结果 -->
		<div class="section">
			<h3>历史扫描结果</h3>
			<el-table :data="scanHistory" style="width: 100%">
				<el-table-column prop="fileName" label="代码文件名称" />
				<el-table-column prop="tool" label="检测工具" />
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
import { fetchProjectData } from '@/api/index';

// 路由参数和项目信息
const route = useRoute();
const projectId = route.params.id; // 获取传递过来的项目ID

const projectInfo = ref({
	projectName: '',
	createdAt: '',
	owner: '',
	status: '',
	description: '',
});

// 获取项目数据
const getProjectData = async () => {
	try {
		const res = await fetchProjectData();
		const project = res.data.list.find((item) => item.id === Number(projectId));
		if (project) {
			projectInfo.value = {
				projectName: project.projectName,
				createdAt: project.createdAt,
				owner: project.owner,
				status: project.status,
				description: project.description,
			};
		} else {
			projectInfo.value.projectName = '项目不存在';
		}
	} catch (error) {
		console.error("获取项目数据失败：", error);
		ElMessage.error("获取项目数据失败");
	}
};

// 上传文件处理
const handleFileChange = (file) => {
	console.log('文件上传:', file);
};

// 检测工具和策略
const tools = [
	{ label: '工具 A', value: 'toolA' },
	{ label: '工具 B', value: 'toolB' },
	{ label: '工具 C', value: 'toolC' },
];
const strategies = [
	{ label: '策略 X', value: 'strategyX' },
	{ label: '策略 Y', value: 'strategyY' },
	{ label: '策略 Z', value: 'strategyZ' },
];
const selectedTool = ref('');
const selectedStrategy = ref('');

// 操作按钮事件
const startScan = () => {
	if (!selectedTool.value || !selectedStrategy.value) {
		ElMessage.error('请先选择工具和策略');
		return;
	}
	console.log('开始扫描:', selectedTool.value, selectedStrategy.value);
};

const exportReport = () => {
	ElMessage.success('报告已导出');
};

// 历史扫描记录
const scanHistory = ref([
	{ fileName: 'main.py', tool: '工具 A', strategy: '策略 X', date: '2024-10-01', vulnerabilities: 5 },
	{ fileName: 'module1.js', tool: '工具 B', strategy: '策略 Y', date: '2024-10-02', vulnerabilities: 2 },
	{ fileName: 'app.java', tool: '工具 C', strategy: '策略 Z', date: '2024-10-03', vulnerabilities: 1 },
]);

// 查看扫描详情
const viewScanDetails = (row) => {
	console.log('查看扫描详情:', row);
};

// 初始化时获取项目数据
onMounted(() => {
	getProjectData();
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
