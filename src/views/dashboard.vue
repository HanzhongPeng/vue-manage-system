<template>
    <div>
        <el-row :gutter="20" class="mgb20">            
            <el-col :span="6">
                <el-card shadow="hover" body-class="card-body">
                    <div class="card-content">
                        <countup class="card-num color4" :end="projectCount" />
                        <div>项目数量</div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover" body-class="card-body">
                    <!-- <el-icon class="card-icon bg1">
                        <User />
                    </el-icon> -->
                    <div class="card-content">
                        <countup class="card-num color1" :end="7" />
                        <div>工具数量</div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover" body-class="card-body">
                    <div class="card-content">
                        <countup class="card-num color1" :end="strategyCount" />
                        <div>策略数量</div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover" body-class="card-body">
                    <div class="card-content">
                        <countup class="card-num color3" :end="totalVulnerabilities" />
                        <div>检测出的漏洞数量</div>
                    </div>
                </el-card>
            </el-col>

        </el-row>

        <el-row :gutter="24" class="mgb20">
            <el-col :span="12">
                <el-card shadow="hover">
                    <div class="card-header">
                        <p class="card-header-title">漏洞检测动态</p>
                        <p class="card-header-desc">最近一周漏洞检测动态</p>
                    </div>
                    <v-chart class="chart" :option="dashOpt1" />
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card shadow="hover">
                    <div class="card-header">
                        <p class="card-header-title">漏洞种类分布</p>
                        <p class="card-header-desc">不同种类漏洞分布情况</p>
                    </div>
                    <v-chart class="chart" :option="dashOpt2" />
                </el-card>
            </el-col>
        </el-row>
        <!-- <el-row :gutter="20">
            <el-col :span="7">
                <el-card shadow="hover" :body-style="{ height: '400px' }">
                    <div class="card-header">
                        <p class="card-header-title">时间线</p>
                        <p class="card-header-desc">最新的销售动态和活动信息</p>
                    </div>
                    <el-timeline>
                        <el-timeline-item v-for="(activity, index) in activities" :key="index" :color="activity.color">
                            <div class="timeline-item">
                                <div>
                                    <p>{{ activity.content }}</p>
                                    <p class="timeline-desc">{{ activity.description }}</p>
                                </div>
                                <div class="timeline-time">{{ activity.timestamp }}</div>
                            </div>
                        </el-timeline-item>
                    </el-timeline>
                </el-card>
            </el-col>
            <el-col :span="10">
                <el-card shadow="hover" :body-style="{ height: '400px' }">
                    <div class="card-header">
                        <p class="card-header-title">渠道统计</p>
                        <p class="card-header-desc">最近一个月的订单来源统计</p>
                    </div>
                    <v-chart class="map-chart" :option="mapOptions" />
                </el-card>
            </el-col>
            <el-col :span="7">
                <el-card shadow="hover" :body-style="{ height: '400px' }">
                    <div class="card-header">
                        <p class="card-header-title">排行榜</p>
                        <p class="card-header-desc">销售商品的热门榜单Top5</p>
                    </div>
                    <div>
                        <div class="rank-item" v-for="(rank, index) in ranks">
                            <div class="rank-item-avatar">{{ index + 1 }}</div>
                            <div class="rank-item-content">
                                <div class="rank-item-top">
                                    <div class="rank-item-title">{{ rank.title }}</div>
                                    <div class="rank-item-desc">销量：{{ rank.value }}</div>
                                </div>
                                <el-progress
                                    :show-text="false"
                                    striped
                                    :stroke-width="10"
                                    :percentage="rank.percent"
                                    :color="rank.color"
                                />
                            </div>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row> -->
    </div>
</template>

<script setup lang="ts" name="dashboard">
import countup from '@/components/countup.vue';
import { use, registerMap } from 'echarts/core';
import { BarChart, LineChart, PieChart, MapChart } from 'echarts/charts';
import {
    GridComponent,
    TooltipComponent,
    LegendComponent,
    TitleComponent,
    VisualMapComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import VChart from 'vue-echarts';
import { dashOpt1, mapOptions } from './chart/options';
import chinaMap from '@/utils/china';
import { ref, onMounted,watch } from 'vue';
import request from '@/utils/request';
use([
    CanvasRenderer,
    BarChart,
    GridComponent,
    LineChart,
    PieChart,
    TooltipComponent,
    LegendComponent,
    TitleComponent,
    VisualMapComponent,
    MapChart,
]);
registerMap('china', chinaMap);

const strategyCount = ref(0); // 定义策略数量的响应式变量

const vulnerabilities = ref([]); // 存储漏洞数据
const totalVulnerabilities = ref(0); // 总漏洞数量

// 漏洞种类分布数据，用于动态更新图表
const vulnerabilitiesDistribution = ref([]);

// 获取漏洞数据的函数
const fetchVulnerabilities = async () => {
    try {
        const response = await request({
            url: 'http://26.142.76.59:8080/api/vulnerabilities',
            method: 'GET',
        });

        if (response.status === 200 && Array.isArray(response.data)) {
            vulnerabilities.value = response.data;

            // 统计漏洞总数
            totalVulnerabilities.value = vulnerabilities.value.reduce((sum, vuln) => {
                return sum + (vuln.count || 0); // 确保count存在
            }, 0);
            console.log(response.data)

            // 更新漏洞种类分布数据
            vulnerabilitiesDistribution.value = vulnerabilities.value.map(vuln => ({
                name: vuln.name,
                value: vuln.count,
            }));
        } else {
            console.error('获取漏洞数据失败，数据格式不正确');
        }
    } catch (error) {
        console.error('获取漏洞数据失败：', error);
    }
};





// 获取策略数量的函数
const fetchStrategyCount = async () => {
    try {
        const response = await request({
            url: 'http://26.142.76.59:8080/api/strategies',
            method: 'GET',
        });

        // 检查响应数据
        if (response && response.status === 200 && Array.isArray(response.data)) {
            strategyCount.value = response.data.length; // 更新策略总数
        } else {
            console.error('获取策略列表失败，数据格式不正确');
        }
    } catch (error) {
        console.error('获取策略数据失败：', error);
    }
};

const summaryData = {
    "过时的编译器版本": 2,
    "违反代币标准": 1,
    "具有区块 Gas 限制的 DoS": 1,
    "意外的以太币余额": 1,
    "不安全的类型转换": 1,
    "使用已弃用的 Solidity 函数": 1,
    "函数默认可见性": 1,
};



const uploadVulnerabilitySummary = async (summary) => {
    try {
        const uploadPromises = Object.entries(summary).map(async ([name, count]) => {
            if (!Number.isInteger(count) || count <= 0) {
                console.warn(`跳过无效的数量：${count}，漏洞名称："${name}"`);
                return;
            }

            // 构造请求 URL
            const url = `http://26.142.76.59:8080/api/vulnerabilities/increase/${name}`;
            console.log("发送请求 URL:", url);
            console.log("发送请求 body:", { count });

            // 发送 POST 请求
            const response = await request({
                url,
                method: 'POST',
                data: { count }, // 上传数量
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // 检查响应状态
            if (response.status === 200) {
                console.log(`漏洞 "${name}" 数量增加成功`);
            } else {
                console.error(`漏洞 "${name}" 上传失败：`, response.data);
            }
        });

        await Promise.all(uploadPromises);
        console.log("所有漏洞总结已上传到后端");
    } catch (error) {
        console.error("上传漏洞总结失败：", error);
    }
};




uploadVulnerabilitySummary(summaryData);

const activities = [
    {
        content: '收藏商品',
        description: 'xxx收藏了你的商品，就是不买',
        timestamp: '30分钟前',
        color: '#00bcd4',
    },
    {
        content: '用户评价',
        description: 'xxx给了某某商品一个差评，吐血啊',
        timestamp: '55分钟前',
        color: '#1ABC9C',
    },
    {
        content: '订单提交',
        description: 'xxx提交了订单，快去收钱吧',
        timestamp: '1小时前',
        color: '#3f51b5',
    },
    {
        content: '退款申请',
        description: 'xxx申请了仅退款，又要亏钱了',
        timestamp: '15小时前',
        color: '#f44336',
    },
    {
        content: '商品上架',
        description: '运营专员瞒着你上架了一辆飞机',
        timestamp: '1天前',
        color: '#009688',
    },
];


// 定义项目总数的响应式变量
const projectCount = ref(0);

// 获取项目总数的函数
const fetchProjectCount = async () => {
    try {
        const response = await request({
            url: `http://26.142.76.59:8080/api/projects`,
            method: 'GET',
        });

        // 检查响应数据
        if (response && response.status === 200 && Array.isArray(response.data)) {
            projectCount.value = response.data.length; // 更新项目总数
        } else {
            console.error('获取项目总数失败，数据格式不正确');
        }
    } catch (error) {
        console.error('获取项目数据失败：', error);
    }
};

// 在组件挂载时调用获取项目总数的函数
onMounted(() => {
    fetchProjectCount();
    fetchStrategyCount();
    fetchVulnerabilities();
});

// 初始的漏洞种类分布图表配置
const dashOpt2 = ref({
    title: {
        text: '漏洞种类分布',
        left: 'center',
    },
    tooltip: {
        trigger: 'item',
    },
    legend: {
        orient: 'vertical',
        left: 'left',
    },
    series: [
        {
            name: '漏洞种类',
            type: 'pie',
            radius: '50%',
            data: [],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                },
            },
        },
    ],
});

// 动态更新图表数据
watch(vulnerabilitiesDistribution, (newData) => {
    // 过滤掉 value 为 0 的数据
    const filteredData = newData.filter(item => item.value > 0);

    if (filteredData.length === 0) {
        // 如果过滤后没有数据，显示“暂无漏洞数据”
        dashOpt2.value = {
            title: {
                text: '暂无漏洞数据',
                left: 'center',
                textStyle: { color: '#999', fontSize: 16 },
            },
            tooltip: { show: false },
            legend: { show: false },
            series: [
                {
                    type: 'pie',
                    radius: '50%',
                    data: [{ name: '无数据', value: 0 }],
                    label: { show: false },
                },
            ],
        };
    } else {
        // 正常显示过滤后的数据
        dashOpt2.value = {
            title: {
                text: '漏洞种类分布',
                left: 'center',
            },
            tooltip: {
                trigger: 'item',
            },
            legend: {
                orient: 'vertical',
                left: 'left',
            },
            series: [
                {
                    name: '漏洞种类',
                    type: 'pie',
                    radius: '50%',
                    data: filteredData, // 使用过滤后的数据
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)',
                        },
                    },
                },
            ],
        };
    }
});

const ranks = [
    {
        title: '手机',
        value: 10000,
        percent: 80,
        color: '#f25e43',
    },
    {
        title: '电脑',
        value: 8000,
        percent: 70,
        color: '#00bcd4',
    },
    {
        title: '相机',
        value: 6000,
        percent: 60,
        color: '#64d572',
    },
    {
        title: '衣服',
        value: 5000,
        percent: 55,
        color: '#e9a745',
    },
    {
        title: '书籍',
        value: 4000,
        percent: 50,
        color: '#009688',
    },
];
</script>

<style>
.card-body {
    display: flex;
    align-items: center;
    height: 100px;
    padding: 0;
}
</style>
<style scoped>
.card-content {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #999;
    padding: 0 20px;
}

.card-num {
    font-size: 30px;
}

.card-icon {
    font-size: 50px;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    color: #fff;
}

.bg1 {
    background: #2d8cf0;
}

.bg2 {
    background: #64d572;
}

.bg3 {
    background: #f25e43;
}

.bg4 {
    background: #e9a745;
}

.color1 {
    color: #2d8cf0;
}

.color2 {
    color: #64d572;
}

.color3 {
    color: #f25e43;
}

.color4 {
    color: #e9a745;
}

.chart {
    width: 100%;
    height: 400px;
}

.card-header {
    padding-left: 10px;
    margin-bottom: 20px;
}

.card-header-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 5px;
}

.card-header-desc {
    font-size: 14px;
    color: #999;
}

.timeline-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    color: #000;
}

.timeline-time,
.timeline-desc {
    font-size: 12px;
    color: #787878;
}

.rank-item {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.rank-item-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #f2f2f2;
    text-align: center;
    line-height: 40px;
    margin-right: 10px;
}

.rank-item-content {
    flex: 1;
}

.rank-item-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #343434;
    margin-bottom: 10px;
}

.rank-item-desc {
    font-size: 14px;
    color: #999;
}
.map-chart {
    width: 100%;
    height: 350px;
}
</style>
