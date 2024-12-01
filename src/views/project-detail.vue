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
    <el-table-column label="状态" width="120">
        <template #default="{ row }">
            {{ translateStatus(row.status) }}
        </template>
    </el-table-column>
    <el-table-column prop="start_time" label="开始时间" width="180" />
    <el-table-column prop="end_time" label="结束时间" width="180" />
    <el-table-column label="操作" width="120">
        <template #default="{ row }">
            <el-button
                v-if="row.status === 'completed'"
                type="text"
                @click="viewExecutionDetails(row.id)"
            >
                查看扫描结果
            </el-button>
            <span v-else>/</span>
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
    title="扫描结果"
    width="800px"
    :before-close="() => (showModal = false)"
>
    <template v-if="parsedOutput">
        <!-- 工具检测结果部分 -->
        <div>
            <h3>工具检测结果：</h3>
            <div v-for="(tools, contractName) in parsedOutput.tools" :key="contractName">
                <h4><br>合约名称：{{ contractName }}</h4>
                <div v-for="(toolResult, toolName) in tools" :key="toolName" style="margin-left: 20px;">
                    <p>扫描工具名称：{{ toolName }}</p>
                    <p>检测时间：{{ toolResult.检测时间 }}</p>
                    <p>是否存在漏洞：
                        <span :style="{ color: toolResult.是否存在漏洞 ? 'red' : 'green' }">
                            {{ toolResult.是否存在漏洞 ? '是' : '否' }}
                        </span>
                    </p>
                    <div v-if="toolResult.漏洞列表.length">
                        
                        <ul>
                            <li v-for="(vulnerability, index) in toolResult.漏洞列表" :key="index">
                                <strong>漏洞类型：</strong> {{ vulnerability.漏洞类型 }}
                                <br />
                                <strong>漏洞描述：</strong> {{ vulnerability.描述 }}
                                <br />
                                <strong>解决方案：</strong> {{ vulnerability.解决方案 }}<br><br>
                            </li>
                        </ul>
                    </div>
                    <div v-else>
                        <p>该工具未检测出漏洞<br><br></p>
                    </div>
                </div>
            </div>
        </div>

        <!-- 漏洞总结部分 -->
        <div style="margin-top: 20px;">
    <h3>漏洞总结：</h3>
    <div v-if="parsedOutput && Object.keys(parsedOutput.summary).length > 0">
        <ul>
            <li v-for="(count, type) in parsedOutput.summary" :key="type">
                {{ type }}：{{ count }} 个
            </li>
        </ul>
    </div>
    <div v-else>
        <p>该执行未扫描出漏洞</p>
    </div>
</div>

    </template>
    <template v-else>
        <p>{{ outputContent }}</p>
    </template>
    <span slot="footer" class="dialog-footer">
        <el-button @click="() => (showModal = false)">关闭</el-button>
    </span>
</el-dialog>








</template>

<script setup lang="ts">
import { ref, onMounted , onBeforeUnmount} from 'vue';
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




const translateStatus = (status) => {
    const statusMap = {
        running: '扫描中',
        failed: '扫描失败',
        completed: '扫描成功',
    };
    return statusMap[status] || '未知状态';
};



const showModal = ref(false); // 控制弹窗显示
const selectedDetails = ref(null); // 当前选中的合约详情


const outputContent = ref(''); // 原始扫描结果内容
const parsedOutput = ref(null); // 解析后的结构化数据

const getExecutionOutput = async (executionId) => {
    try {
        const response = await request({
            url: `http://26.142.76.59:8080/api/executions/${executionId}/output`,
            method: 'GET',
            responseType: 'text', // 确保接收到文本
        });

        if (response?.status === 200) {
            outputContent.value = response.data || '无扫描结果';

            // 解析扫描结果
            const [jsonPart, summaryPart] = outputContent.value.split(/}\s+漏洞总结：/); // 按 "} 漏洞总结：" 分割
            const toolsResult = JSON.parse(`${jsonPart}}`.trim()); // 补全 JSON 格式并解析
            const summaryDetails = {};
            const regex = /漏洞类型：(.+?)；漏洞个数：(\d+)/g;

            // 解析漏洞总结部分
            let match;
            while ((match = regex.exec(summaryPart.trim())) !== null) {
                const [_, type, count] = match;
                summaryDetails[type] = parseInt(count, 10);
            }

            // 存储解析结果
            parsedOutput.value = { tools: toolsResult, summary: summaryDetails };
        } else {
            outputContent.value = '未找到扫描结果文件';
            parsedOutput.value = null;
        }
    } catch (error) {
        console.error('获取扫描结果失败：', error);
        outputContent.value = '获取扫描结果失败，请稍后重试';
        parsedOutput.value = null;
    }
};

const viewExecutionDetails = async (executionId) => {
    await getExecutionOutput(executionId); // 获取扫描结果
    showModal.value = true; // 打开弹窗
};

// 解析 JSON 数据
// 解析完整数据
const parseExecutionOutput = (rawData) => {
    let toolsPart = {};
    let summaryText = "";
    let summaryDetails = {};

    if (typeof rawData === "string") {
        // 按 "漏洞总结：" 作为分隔符拆分
        const [jsonPart, summaryPart] = rawData.split(/漏洞总结：/);
        toolsPart = JSON.parse(jsonPart.trim());
        summaryText = `漏洞总结：${summaryPart}`;
    } else if (typeof rawData === "object") {
        toolsPart = rawData; // 如果是对象，直接使用
    } else {
        throw new Error("Unsupported rawData format");
    }

    // 解析漏洞总结部分
    if (summaryText) {
        const regex = /漏洞类型：(.+?)；漏洞个数：(\d+)/g;
        let match;
        while ((match = regex.exec(summaryText)) !== null) {
            const [_, type, count] = match;
            summaryDetails[type] = parseInt(count, 10);
        }
    }

    return { tools: toolsPart, summary: { text: summaryText, details: summaryDetails } };
};




// 解析工具检测结果
const parseToolResults = (tools) => {
    const toolResults = {};
    for (const [contractName, toolsData] of Object.entries(tools)) {
        toolResults[contractName] = {};
        for (const [toolName, toolResult] of Object.entries(toolsData)) {
            toolResults[contractName][toolName] = {
                合约名称: toolResult["合约名称"],
                工具名称: toolResult["工具名称"],
                检测时间: formatTime(toolResult["检测时间"]),
                是否存在漏洞: toolResult["是否存在漏洞"],
                漏洞列表: toolResult["漏洞列表"].map((vul) => ({
                    漏洞类型: vul["漏洞类型"],
                    描述: vul["描述"],
                    解决方案: vul["解决方案"],
                })),
            };
        }
    }
    console.log("解析的工具检测结果：", toolResults);
    return toolResults;
};

const parseExecutionDetailsToText = (rawData) => {
    let toolsText = "";
    let summaryText = "";

    if (typeof rawData === "string") {
        // 按分隔符 "} 漏洞总结：" 分割
        const [jsonPart, summary] = rawData.split(/}\s+漏洞总结：/);
        toolsText = jsonPart ? `${jsonPart}}` : ""; // 工具检测部分
        summaryText = summary ? `漏洞总结：${summary}` : ""; // 漏洞总结部分
    } else if (typeof rawData === "object") {
        // 遍历对象形式的数据
        const keys = Object.keys(rawData);
        const summaryIndex = keys.findIndex((key) => key.startsWith("漏洞总结"));
        const toolsPart = Object.fromEntries(keys.slice(0, summaryIndex).map((key) => [key, rawData[key]]));
        summaryText = keys
            .slice(summaryIndex)
            .map((key) => `${key} ${rawData[key]}`)
            .join("\n");

        // 将工具检测部分转化为文本
        toolsText = JSON.stringify(toolsPart, null, 2); // 格式化为易读的 JSON 字符串
    } else {
        throw new Error("Unsupported rawData format");
    }

    return { toolsText, summaryText };
};



const parseSummary = (summaryText) => {
    const summaryDetails = {};
    const regex = /漏洞类型：(.+?)；漏洞个数：(\d+)/g;
    let match;
    while ((match = regex.exec(summaryText)) !== null) {
        const [_, type, count] = match;
        summaryDetails[type] = parseInt(count, 10);
    }

    console.log("解析的漏洞总结部分：", summaryDetails);
    return { summaryText, summaryDetails };
};






const executionRecords = ref([]); // 存储执行记录

let lastStatuses = new Map(); // 记录上次的执行状态


// const getExecutionRecords = async () => {
//     try {
//         const response = await request({
//             url: `http://26.142.76.59:8080/api/executions/project/${projectId}`,
//             method: 'GET',
//         });

//         if (response?.status === 200) {
//             const records = response.data;

//             // 检查状态变化并弹窗提示
//             records.forEach((record) => {
//                 const prevStatus = lastStatuses.get(record.id);
//                 if (prevStatus !== record.status) {
//                     if (record.status === 'completed') {
//                         ElMessage({
//                             message: `扫描完成：任务ID ${record.id}`,
//                             type: 'success',
//                             duration: 2000,
//                         });
//                     } else if (record.status === 'failed') {
//                         ElMessage({
//                             message: `扫描失败：任务ID ${record.id}`,
//                             type: 'error',
//                             duration: 2000,
//                         });
//                     }
//                 }
//                 // 更新状态
//                 lastStatuses.set(record.id, record.status);
//             });

//             // 更新表格数据
//             executionRecords.value = await Promise.all(
//                 records.map(async (record) => {
//                     try {
//                         const strategyResponse = await request({
//                             url: `http://26.142.76.59:8080/api/strategies/${record.strategy_id}`,
//                             method: 'GET',
//                         });

//                         return {
//                             id: record.id,
//                             strategy_name: strategyResponse?.data?.name || '未知策略',
//                             status: record.status,
//                             start_time: formatTime(record.start_time),
//                             end_time: formatTime(record.end_time),
//                         };
//                     } catch {
//                         return {
//                             id: record.id,
//                             strategy_name: '获取策略名称失败',
//                             status: record.status,
//                             start_time: formatTime(record.start_time),
//                             end_time: formatTime(record.end_time),
//                         };
//                     }
//                 })
//             );
//         } else {
//             console.error('获取执行结果失败');
//         }
//     } catch (error) {
//         console.error('获取执行结果失败：', error);
//         // ElMessage.error('获取执行结果失败，请稍后重试');
//     }
// };


// 从 localStorage 恢复提示记录
const getProcessedTasksFromStorage = () => {
    const storedData = localStorage.getItem('processedTasks');
    return storedData ? JSON.parse(storedData) : {};
};

// 保存提示记录到 localStorage
const saveProcessedTasksToStorage = (data) => {
    localStorage.setItem('processedTasks', JSON.stringify(data));
};

// 初始化 processedTasks
let processedTasks = getProcessedTasksFromStorage();

// const getExecutionRecords = async () => {
//     try {
//         const response = await request({
//             url: `http://26.142.76.59:8080/api/executions/project/${projectId}`,
//             method: 'GET',
//         });

//         if (response?.status === 200) {
//             const records = response.data;

//             // 检查状态变化并弹窗提示
//             records.forEach((record) => {
//                 const prevStatus = lastStatuses.get(record.id);
//                 const hasBeenProcessed = processedTasks[record.id]?.includes(record.status);

//                 // 如果状态发生变化且未提示过
//                 if (prevStatus !== record.status && !hasBeenProcessed) {
//                     if (record.status === 'completed') {
//                         ElMessage({
//                             message: `扫描完成：任务ID ${record.id}`,
//                             type: 'success',
//                             duration: 2000,
//                         });
//                     } else if (record.status === 'failed') {
//                         ElMessage({
//                             message: `扫描失败：任务ID ${record.id}`,
//                             type: 'error',
//                             duration: 2000,
//                         });
//                     }

//                     // 更新状态记录并标记为已处理
//                     lastStatuses.set(record.id, record.status);

//                     // 更新 processedTasks 并持久化
//                     if (!processedTasks[record.id]) {
//                         processedTasks[record.id] = [];
//                     }
//                     processedTasks[record.id].push(record.status);
//                     saveProcessedTasksToStorage(processedTasks);
//                 } else {
//                     // 更新状态，但不提示
//                     lastStatuses.set(record.id, record.status);
//                 }
//             });

//             // 更新表格数据
//             executionRecords.value = await Promise.all(
//                 records.map(async (record) => {
//                     try {
//                         const strategyResponse = await request({
//                             url: `http://26.142.76.59:8080/api/strategies/${record.strategy_id}`,
//                             method: 'GET',
//                         });

//                         return {
//                             id: record.id,
//                             strategy_name: strategyResponse?.data?.name || '未知策略',
//                             status: record.status,
//                             start_time: formatTime(record.start_time),
//                             end_time: formatTime(record.end_time),
//                         };
//                     } catch {
//                         return {
//                             id: record.id,
//                             strategy_name: '获取策略名称失败',
//                             status: record.status,
//                             start_time: formatTime(record.start_time),
//                             end_time: formatTime(record.end_time),
//                         };
//                     }
//                 })
//             );
//         }
//     } catch (error) {
//         console.error('获取执行结果失败：', error);
//         // ElMessage.error('获取执行结果失败，请稍后重试');
//     }
// };

// 时间格式化函数
const formatTime = (time) => {
    if (time === '0001-01-01T00:00:00Z') {
        return '/'; // 如果时间为初始时间，显示 "/"
    }
    return new Date(time).toLocaleString(); // 格式化为本地时间字符串
};

const getExecutionRecords = async () => {
    try {
        const response = await request({
            url: `http://26.142.76.59:8080/api/executions/project/${projectId}`,
            method: 'GET',
        });

        if (response?.status === 200) {
            const records = response.data;

            records.forEach((record) => {
                const prevStatus = lastStatuses.get(record.id);

                // 检查状态是否变为 completed
                if (prevStatus !== record.status && record.status === 'completed') {
                    console.log(`扫描完成：任务ID ${record.id}`);
                    sendVulnerabilitiesToBackend(); // 自动发送漏洞总结
                }

                // 更新状态
                lastStatuses.set(record.id, record.status);
            });

            // 更新执行记录表格
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
        }
    } catch (error) {
        console.error('获取执行结果失败：', error);
    }
};


const sendVulnerabilitiesToBackend = async () => {
    if (!parsedOutput.value || !parsedOutput.value.summary) {
        console.warn("漏洞总结为空，无法发送到后端");
        return;
    }

    const summary = parsedOutput.value.summary;

    const promises = Object.entries(summary).map(async ([name, count]) => {
        try {
            await request({
                url: `/vulnerabilities/increase/${encodeURIComponent(name)}`,
                method: 'POST',
                data: { count },
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log(`漏洞 "${name}" 数量增加成功`);
        } catch (error) {
            console.error(`发送漏洞 "${name}" 数据失败：`, error);
        }
    });

    await Promise.all(promises);
    console.log("漏洞总结已发送到后端");
};



// const viewExecutionDetails = (row) => {
//     console.log('查看执行详情:', row);
//     router.push({
//         name: 'executionDetail',
//         params: { executionId: row.id },
//     });
// };

// const viewExecutionDetails = async (executionId) => {
//     await getExecutionOutput(executionId); // 获取输出文件内容
//     showModal.value = true; // 显示弹窗
// };



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
		// ElMessage.error("获取项目数据失败");
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
			console.error("获取策略列表失败：");
		}
	} catch (error) {
		console.error("获取策略列表失败：", error);
		// ElMessage.error("获取策略列表失败");
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
        // 显示开始扫描的绿色提示
        ElMessage({
            message: '开始扫描',
            type: 'success',
            duration: 2000,
        });

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

        // 自动刷新执行结果表格
        await getExecutionRecords();
    } catch (error) {
        // 显示红色错误提示
        ElMessage({
            message: '扫描失败，请稍后重试',
            type: 'error',
            duration: 2000,
        });
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
        // ElMessage.error("获取已上传文件失败，请稍后重试");
    }
};

let refreshInterval = null;
// 初始化时获取项目和策略数据
onMounted(() => {
	getProjectData();
	getStrategies();
	getUploadedFiles(); // 获取已上传文件列表
	getExecutionRecords(); // 获取执行记录

    refreshInterval = setInterval(() => {
        getExecutionRecords();
    }, 1000); // 10秒刷新一次
});

onBeforeUnmount(() => {
    // 组件卸载时清除定时器
    clearInterval(refreshInterval);
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
