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

			<!-- 显示已上传文件列表 -->
			<div v-if="uploadedFiles.length > 0" class="uploaded-files">
				<h4>已上传文件</h4>
				<el-table :data="uploadedFiles.map(file => ({ fileName: file }))" style="width: 100%">
					<el-table-column prop="fileName" label="文件名称" />
				</el-table>
			</div>
			<div v-else>
				<p>暂无已上传文件。</p>
			</div>
		</div>

		<div class="section">
			<h3>检测策略</h3>
			<el-select
				v-model="selectedStrategyId"
				placeholder="请选择检测策略"
				class="strategy-select"
				style="width: 100%; margin-bottom: 10px;"
			>
				<el-option
					v-for="strategy in strategies"
					:key="strategy.id"
					:label="strategy.name"
					:value="strategy.id"
				/>
			</el-select>

</div>

		<!-- 操作按钮 -->
		<div class="buttons">
			<el-button type="primary" @click="startScan">开始扫描</el-button>
			<el-button type="success" @click="exportReport">导出报告</el-button>
		</div>

		<!-- 扫描结果 -->
		<div class="section">
    <h3>执行结果</h3>
    <el-table :data="executionRecords" style="width: 100%">
        <el-table-column prop="id" label="执行ID" width="120" />
        <el-table-column prop="strategy_name" label="策略名称" width="200" />
        <el-table-column prop="status" label="状态" width="120" />
        <el-table-column prop="start_time" label="开始时间" width="180" />
        <el-table-column prop="end_time" label="结束时间" width="180" />
        <el-table-column label="操作" width="120">
            <template #default="{ row }">
                <el-button type="text" @click="viewExecutionDetails(row.id)">查看详情</el-button>
            </template>
        </el-table-column>
    </el-table>
    <div v-if="executionRecords.length === 0" class="empty-state">
        <p>暂无执行记录。</p>
    </div>
</div>

	</div>


	<el-dialog
    v-model="showModal"
    title="执行详情"
    width="600px"
    :before-close="() => (showModal = false)"
>
    <p v-if="outputContent">{{ outputContent }}</p>
    <p v-else>正在加载输出文件...</p>
    <span slot="footer" class="dialog-footer">
        <el-button @click="() => (showModal = false)">关闭</el-button>
    </span>
</el-dialog>
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


const outputContent = ref(''); // 存储弹窗中的输出文件内容
const showModal = ref(false); // 控制弹窗的显示状态

const getExecutionOutput = async (executionId) => {
    try {
        const response = await request({
            url: `http://26.142.76.59:8080/api/executions/${executionId}/output`,
            method: 'GET',
            responseType: 'text', // 确保以文本形式接收数据
        });

        if (response?.status === 200) {
            outputContent.value = response.data || '无输出内容';
        } else {
            outputContent.value = '未找到执行记录或输出文件';
        }
    } catch (error) {
        console.error('获取输出文件失败：', error);
        outputContent.value = '获取输出文件失败，请稍后重试';
    }
};




const executionRecords = ref([]); // 存储执行记录

const getExecutionRecords = async () => {
    try {
        const response = await request({
            url: `http://26.142.76.59:8080/api/executions/project/${projectId}`,
            method: 'GET',
        });

        if (response?.status === 200) {
            // 格式化执行记录数据
            const records = response.data;

            // 获取每个策略的名称
            executionRecords.value = await Promise.all(
                records.map(async (record) => {
                    try {
                        const strategyResponse = await request({
                            url: `http://26.142.76.59:8080/api/strategies/${record.strategy_id}`,
                            method: 'GET',
                        });

                        return {
                            id: record.id,
                            strategy_name: strategyResponse?.data?.name || '未知策略',
                            status: record.status,
                            start_time: formatTime(record.start_time),
                            end_time: formatTime(record.end_time),
                        };
                    } catch {
                        return {
                            id: record.id,
                            strategy_name: '获取策略名称失败',
                            status: record.status,
                            start_time: formatTime(record.start_time),
                            end_time: formatTime(record.end_time),
                        };
                    }
                })
            );
        } else {
            ElMessage.error('获取执行结果失败');
        }
    } catch (error) {
        console.error('获取执行结果失败：', error);
        ElMessage.error('获取执行结果失败，请稍后重试');
    }
};


// 时间格式化函数
const formatTime = (time) => {
    if (time === '0001-01-01T00:00:00Z') {
        return '/'; // 如果时间为初始时间，显示 "/"
    }
    return new Date(time).toLocaleString(); // 格式化为本地时间字符串
};


// const viewExecutionDetails = (row) => {
//     console.log('查看执行详情:', row);
//     router.push({
//         name: 'executionDetail',
//         params: { executionId: row.id },
//     });
// };

const viewExecutionDetails = async (executionId) => {
    await getExecutionOutput(executionId); // 获取输出文件内容
    showModal.value = true; // 显示弹窗
};



// 格式化后的创建时间
const formattedCreatedAt = ref('');

// 获取项目数据
const getProjectData = async () => {
	try {
		const response = await request({
			url: `http://26.142.76.59:8080/api/projects/${projectId}`,
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
			url: 'http://26.142.76.59:8080/api/strategies',
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
const uploadUrl = `http://26.142.76.59:8080/api/projects/${projectId}/upload`;
const headers = { /* 在此配置需要的headers */ };
const uploadData = { id: projectId };

// 上传成功和失败的处理
const handleUploadSuccess = () => {
	ElMessage.success("文件上传成功");
	getUploadedFiles(); 
};

const handleUploadError = (error) => {
	console.error("文件上传失败：", error);
	ElMessage.error("文件上传失败");
};

// 检测策略选择
const selectedStrategyId = ref(''); // 存储选择的策略ID

// // 操作按钮事件
// const startScan = () => {
// 	if (!selectedStrategyId.value) {
// 		ElMessage.error('请先选择检测策略');
// 		return;
// 	}
// 	console.log('开始扫描，使用策略 ID:', selectedStrategyId.value);
// 	// 在这里添加调用开始扫描的接口
// };

const startScan = async () => {
    // 判断是否选择了检测策略
    if (!selectedStrategyId.value) {
        ElMessage.error('请先选择检测策略');
        return;
    }

    // 判断是否有已上传文件
    if (!uploadedFiles.value || uploadedFiles.value.length === 0) {
        ElMessage.error('请先上传文件');
        return;
    }

    try {
        // 构建请求体
        const requestBody = {
            project_id: Number(projectId), // 项目ID
            strategy_id: Number(selectedStrategyId.value), // 策略ID
        };

        // 发起扫描请求
        await request({
            url: `http://26.142.76.59:8080/api/executions/start`,
            method: 'POST',
            data: requestBody,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // 显示扫描成功提示
        ElMessage.success('扫描成功！');

        // 自动刷新执行结果表格
        await getExecutionRecords(); // 重新获取执行结果
    } catch (error) {
        console.error('扫描失败：', error);
        ElMessage.error('扫描失败，请稍后重试');
    }
};









const exportReport = () => {
	ElMessage.success('报告已导出');
};

// 扫描结果
const scanHistory = ref([
	{ fileName: 'timed_crowdsale.sol, governmental_survey.sol, roulette.sol,ether_lotto.sol', strategy: '全面策略-Securify2、smartcheck、mythril', date: '2024-10-01', vulnerabilities: 24 },
	// { fileName: 'module1.js', strategy: '快速策略-Smartcheck', date: '2024-10-02', vulnerabilities: 2 },
	// { fileName: 'app.java', strategy: '特定种类高精度策略-以太锁定-Securify2、ConFuzzius、smartcheck', date: '2024-10-03', vulnerabilities: 1 },
]);

import { useRouter } from 'vue-router';

const router = useRouter();
// 查看扫描详情
const viewScanDetails = (row) => {
	console.log('查看扫描详情:', row);
	router.push({
		name: 'scanDetail',
		params: { fileName: row.fileName }
	});
};

const uploadedFiles = ref([]); // 存储已上传文件列表

const getUploadedFiles = async () => {
    try {
        const response = await request({
            url: `http://26.142.76.59:8080/api/projects/${projectId}/files`,
            method: 'GET',
        });
        if (response.status === 200) {
            uploadedFiles.value = response.data; // 假设返回的是文件名数组
        } else if (response.status === 400) {
            ElMessage.error("无效的项目ID");
        } else if (response.status === 404) {
            ElMessage.error("未找到项目");
        } else {
            ElMessage.error("读取项目目录失败");
        }
    } catch (error) {
        console.error("获取已上传文件失败：", error);
        ElMessage.error("获取已上传文件失败，请稍后重试");
    }
};

// 初始化时获取项目和策略数据
onMounted(() => {
	getProjectData();
	getStrategies();
	getUploadedFiles(); // 获取已上传文件列表
	getExecutionRecords(); // 获取执行记录
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
