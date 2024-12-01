<template>
    <div class="treemap-container">
      <div ref="treemapContainer" class="chart-container"></div>
    </div>
    <div class="bar-chart-container">
      <div ref="barChartContainer" class="chart-container"></div>
    </div>
    <div class="bar-chart-container">
      <div ref="secondBarChartContainer" class="chart-container"></div>
    </div>
    <div class="treemap-container">
        <div ref="thirdTreemapContainer" class="chart-container"></div>
    </div>
    <div class="bar-chart-container">
    <div ref="fourthBarChartContainer" class="chart-container"></div>
    </div>
    <div class="bar-chart-container">
  <div ref="fifthBarChartContainer" class="chart-container"></div>
</div>
<div class="bar-chart-container">
  <div ref="sixthBarChartContainer" class="chart-container"></div>
</div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import * as echarts from 'echarts';
  // import { onBeforeRouteLeave } from 'vue-router';
  
  
  
  // 矩形树图数据
  const treemapData = [
    { name: '事务顺序依赖性', value: 5 },
    { name: '返回值丢失', value: 5 },
    { name: 'require()函数冲突', value: 15 },
    { name: '未初始化的变量', value: 4 },
    { name: '通过 tx.origin 授权', value: 4 },
    { name: '使用硬编码 gas amount 的消息调用', value: 6 },
    { name: '阴影的builtin函数', value: 1 },
    { name: '循环调用', value: 1 },
    { name: '违反代币标准', value: 4 },
    { name: '签名延展性', value: 2 },
    { name: 'Block 值作为时间的代理', value: 2 },
    { name: '意外的以太币余额', value: 3 },
    { name: '以太币/代币锁定', value: 2 },
    { name: '重入漏洞', value: 2 },
    { name: '未处理的异常', value: 3 },
    { name: '存在未使用的变量', value: 2 },
    { name: '外部函数', value: 21 }
  ];
  
  // 第一个柱状图数据
  const barChartData = [
    { name: '事务顺序依赖性', comprehensive: 5, comparison: 0 },
    { name: '返回值丢失', comprehensive: 5, comparison: 5 },
    { name: 'require()函数冲突', comprehensive: 15, comparison: 15 },
    { name: '未初始化的变量', comprehensive: 4, comparison: 2 },
    { name: '通过 tx.origin 授权', comprehensive: 4, comparison: 4 },
    { name: '使用硬编码 gas amount 的消息调用', comprehensive: 6, comparison: 6 },
    { name: '阴影的builtin函数', comprehensive: 1, comparison: 0 },
    { name: '循环调用', comprehensive: 1, comparison: 1 },
    { name: '违反代币标准', comprehensive: 4, comparison: 4 },
    { name: '签名延展性', comprehensive: 2, comparison: 2 },
    { name: 'Block 值作为时间的代理', comprehensive: 2, comparison: 1 },
    { name: '意外的以太币余额', comprehensive: 3, comparison: 3 },
    { name: '以太币/代币锁定', comprehensive: 2, comparison: 2 },
    { name: '重入漏洞', comprehensive: 2, comparison: 0 },
    { name: '未处理的异常', comprehensive: 3, comparison: 0 },
    { name: '存在未使用的变量', comprehensive: 2, comparison: 0 },
    { name: '外部函数', comprehensive: 21, comparison: 0 }
  ];
  
  // 第二个柱状图数据
  const secondBarChartData = [
    { name: '不安全的类型转换', comprehensive: 16, comparison: 16 },
    { name: '使用已弃用的 Solidity 函数', comprehensive: 27, comparison: 23 },
    { name: '未检查的外部调用', comprehensive: 25, comparison: 6 },
    { name: '具有区块 Gas 限制的 DoS', comprehensive: 21, comparison: 21 },
    { name: '函数默认可见性', comprehensive: 58, comparison: 48 },
    { name: '写入任意存储位置', comprehensive: 24, comparison: 0 }
  ];

  const thirdTreemapData = [
  { name: '重入漏洞', value: 10 },
  { name: '算数漏洞', value: 22 },
  { name: '时间戳依赖', value: 5 },
  { name: '以太锁定', value: 7 }
];

const fourthBarChartData = [
  { name: '重入漏洞', total: 10, highAccuracy: 10, comparison: 2 },
  { name: '算数漏洞', total: 22, highAccuracy: 15, comparison: 5 },
  { name: '时间戳依赖', total: 5, highAccuracy: 5, comparison: 3 },
  { name: '以太锁定', total: 7, highAccuracy: 7, comparison: 6 }
];
const fifthBarChartData = [
  { name: '检测出漏洞类型数', fastStrategy1: 12, fastStrategy2: 16, comprehensive: 23 },
  { name: '单个合约平均用时(单位s)', fastStrategy1: 3.29, fastStrategy2: 3.97, comprehensive: 13.1 }
];

const sixthBarChartData = [
  { name: '稻草人合约漏洞', blockchainStrategy: 5, comparisonStrategy: 2 },
  { name: '资金流动漏洞', blockchainStrategy: 23, comparisonStrategy: 12 },
  { name: '隐藏的资金转移', blockchainStrategy: 2, comparisonStrategy: 1 },
  { name: '意外的以太币余额', blockchainStrategy: 2, comparisonStrategy: 0 }
];

  
  // 引用图表容器的 DOM
  const treemapContainer = ref(null);
  const barChartContainer = ref(null);
  const secondBarChartContainer = ref(null);
  const treemapInstance = ref(null);
  const barChartInstance = ref(null);
  const secondBarChartInstance = ref(null);
  const thirdTreemapContainer = ref(null);
  const thirdTreemapInstance = ref(null);
  const fourthBarChartContainer = ref(null);
const fourthBarChartInstance = ref(null);
const fifthBarChartContainer = ref(null);
const fifthBarChartInstance = ref(null);
const sixthBarChartContainer = ref(null);
const sixthBarChartInstance = ref(null);
  
  // 初始化矩形树图
// 第一个矩形树图
const initTreemap = () => {
  if (treemapContainer.value) {
    if (treemapInstance.value) {
      treemapInstance.value.dispose();
    }
    treemapInstance.value = echarts.init(treemapContainer.value);
    treemapInstance.value.setOption({
      title: {
        text: '目标数据集漏洞类型',
        left: 'center'
      },
      tooltip: {
        formatter: '{b}: {c}'
      },
      series: [
        {
          type: 'treemap',
          data: treemapData,
          roam: false,  // 禁用滚轮缩放
          label: {
            show: true,
            formatter: '{b}',
            fontSize: 12
          },
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 1
          }
        }
      ]
    });
  }
};
  
const instances = [
  treemapInstance,
  barChartInstance,
  secondBarChartInstance,
  thirdTreemapInstance,
  fourthBarChartInstance,
  fifthBarChartInstance,
  sixthBarChartInstance,
];


  // 初始化第一个柱状图
  const initBarChart = () => {
    if (barChartContainer.value) {
      barChartInstance.value = echarts.init(barChartContainer.value);
      const categories = barChartData.map(item => item.name);
      const comprehensiveData = barChartData.map(item => item.comprehensive);
      const comparisonData = barChartData.map(item => item.comparison);
  
      barChartInstance.value.setOption({
        title: {
          text: '全面检测策略',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['全面策略', '对照策略1'],
          top: 30
        },
        xAxis: {
          type: 'category',
          data: categories,
          axisLabel: { rotate: 15 }
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '全面策略',
            type: 'bar',
            data: comprehensiveData
          },
          {
            name: '对照策略1',
            type: 'bar',
            data: comparisonData
          }
        ]
      });
    }
  };
  
  // 初始化第二个柱状图
  const initSecondBarChart = () => {
    if (secondBarChartContainer.value) {
      secondBarChartInstance.value = echarts.init(secondBarChartContainer.value);
      const categories = secondBarChartData.map(item => item.name);
      const comprehensiveData = secondBarChartData.map(item => item.comprehensive);
      const comparisonData = secondBarChartData.map(item => item.comparison);
  
      secondBarChartInstance.value.setOption({
        title: {
          text: '全面检测策略 - 对照策略1 漏洞类型对比',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['全面策略', '对照策略1'],
          top: 30
        },
        xAxis: {
          type: 'category',
          data: categories,
          axisLabel: { rotate: 15 }
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '全面策略',
            type: 'bar',
            data: comprehensiveData
          },
          {
            name: '对照策略1',
            type: 'bar',
            data: comparisonData
          }
        ]
      });
    }
  };

// 新增的矩形树图
const initThirdTreemap = () => {
  if (thirdTreemapContainer.value) {
    thirdTreemapInstance.value = echarts.init(thirdTreemapContainer.value);
    thirdTreemapInstance.value.setOption({
      title: {
        text: '目标漏洞类型',
        left: 'center'
      },
      tooltip: {
        formatter: '{b}: {c}'
      },
      series: [
        {
          type: 'treemap',
          data: thirdTreemapData,
          roam: false,  // 禁用滚轮缩放
          label: {
            show: true,
            formatter: '{b}',
            fontSize: 12
          },
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 1
          }
        }
      ]
    });
  }
};

const initFourthBarChart = () => {
  if (fourthBarChartContainer.value) {
    fourthBarChartInstance.value = echarts.init(fourthBarChartContainer.value);

    const categories = fourthBarChartData.map(item => item.name);
    const totalData = fourthBarChartData.map(item => item.total);
    const highAccuracyData = fourthBarChartData.map(item => item.highAccuracy);
    const comparisonData = fourthBarChartData.map(item => item.comparison);

    fourthBarChartInstance.value.setOption({
      title: {
        text: '高精度检测',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['漏洞总数', '高精度策略', '对照策略1'],
        top: 30
      },
      xAxis: {
        type: 'category',
        data: categories,
        axisLabel: { rotate: 30 }
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '漏洞总数',
          type: 'bar',
          data: totalData
        },
        {
          name: '高精度策略',
          type: 'bar',
          data: highAccuracyData
        },
        {
          name: '对照策略1',
          type: 'bar',
          data: comparisonData
        }
      ]
    });
  }
};

const initFifthBarChart = () => {
  if (fifthBarChartContainer.value) {
    fifthBarChartInstance.value = echarts.init(fifthBarChartContainer.value);

    const categories = fifthBarChartData.map(item => item.name);
    const fastStrategy1Data = fifthBarChartData.map(item => item.fastStrategy1);
    const fastStrategy2Data = fifthBarChartData.map(item => item.fastStrategy2);
    const comprehensiveData = fifthBarChartData.map(item => item.comprehensive);

    fifthBarChartInstance.value.setOption({
      title: {
        text: '快速检测策略',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['快速检测策略1', '快速检测策略2', '全面策略'],
        top: 30
      },
      xAxis: {
        type: 'category',
        data: categories,
        axisLabel: { rotate: 0 }
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '快速检测策略1',
          type: 'bar',
          data: fastStrategy1Data
        },
        {
          name: '快速检测策略2',
          type: 'bar',
          data: fastStrategy2Data
        },
        {
          name: '全面策略',
          type: 'bar',
          data: comprehensiveData
        }
      ]
    });
  }
};

const initSixthBarChart = () => {
  if (sixthBarChartContainer.value) {
    sixthBarChartInstance.value = echarts.init(sixthBarChartContainer.value);

    const categories = sixthBarChartData.map(item => item.name);
    const blockchainStrategyData = sixthBarChartData.map(item => item.blockchainStrategy);
    const comparisonStrategyData = sixthBarChartData.map(item => item.comparisonStrategy);

    sixthBarChartInstance.value.setOption({
      title: {
        text: '区块链交易检测',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['区块链交易检测策略', '对照策略1'],
        top: 30
      },
      xAxis: {
        type: 'category',
        data: categories,
        axisLabel: { rotate: 0 }
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '区块链交易检测策略',
          type: 'bar',
          data: blockchainStrategyData
        },
        {
          name: '对照策略1',
          type: 'bar',
          data: comparisonStrategyData
        }
      ]
    });
  }
};



  
  // 在组件挂载后初始化图表
  onMounted(() => {
  initTreemap();
  initBarChart();
  initSecondBarChart();
  initThirdTreemap();
  initFourthBarChart();
  initFifthBarChart();
  initSixthBarChart();
});
  // import { onUnmounted } from 'vue';

//   const disposeInstance = (instance) => {
//   if (instance?.value) {
//     instance.value.dispose();
//     instance.value = null;
//   }
// };

// 在所有实例初始化后，添加如下清理代码：
// onUnmounted(() => {
//   disposeInstance(treemapInstance);
//   disposeInstance(barChartInstance);
//   disposeInstance(secondBarChartInstance);
//   disposeInstance(thirdTreemapInstance);
//   disposeInstance(fourthBarChartInstance);
//   disposeInstance(fifthBarChartInstance);
//   disposeInstance(sixthBarChartInstance);
// });

  
  // 销毁 ECharts 实例

  </script>
  
  <style scoped>
  .treemap-container,
  .bar-chart-container {
    width: 100%;
    height: 100%;
    margin-top: 20px;
  }
  
  .chart-container {
    width: 100%;
    height: 400px; /* 设置图表高度，可根据需求调整 */
  }
  </style>
  