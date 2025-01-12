const CONFIG = {
    // 加密后的API Key (这是示例加密值，需要替换为实际的加密后的API Key)
    ENCRYPTED_API_KEY: 'MjRjNmRmMjE5MTUwNDRjNWE5YTZjMjY2NzU4YTkwYTUuYzZRS1lPOWdhdVNubUNjTw==',
    API_URL: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
    MODEL: 'glm-4',
    DEBUG: true
};

// 解密函数
const decrypt = (encrypted) => {
    try {
        // 简单的Base64解码
        return atob(encrypted);
    } catch (error) {
        console.error('解密失败:', error);
        return '';
    }
};

// 导出解密后的API Key获取函数
export const getApiKey = () => decrypt(CONFIG.ENCRYPTED_API_KEY);

export default CONFIG; 