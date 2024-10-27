import request from '../utils/request';

export const fetchData = () => {
    return request({
        url: './mock/table.json',
        method: 'get'
    });
};

export const fetchUserData = () => {
    return request({
        url: './mock/user.json',
        method: 'get'
    });
};

export const fetchRoleData = () => {
    return request({
        url: './mock/role.json',
        method: 'get'
    });
};

// 获取项目数据
export const fetchProjectData = () => {
    return request({
        url: './mock/project.json', // 项目数据路径
        method: 'get'
    });
};

export const fetchToolData = () => {
    return request({
        url: './mock/tool.json',
        method: 'get'
    });
};

export const fetchStrategyData = () => {
    return request({
        url: './mock/strategy.json',
        method: 'get'
    });
};