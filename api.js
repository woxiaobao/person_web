import CONFIG, { getApiKey } from './config.js';

class ChatAPI {
    static async generateToken() {
        try {
            const apiKey = getApiKey();
            if (!apiKey) {
                throw new Error('API Key not configured');
            }
            return apiKey;
        } catch (error) {
            console.error('Token generation error:', error);
            throw error;
        }
    }

    static async sendMessage(messages) {
        try {
            const token = await this.generateToken();
            console.log('Using token:', token); // 调试日志

            // 确保消息格式正确
            const formattedMessages = messages.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'assistant',
                content: msg.content
            }));

            const requestBody = {
                model: CONFIG.MODEL,
                messages: formattedMessages,
                stream: false // 添加stream参数
            };

            console.log('Request body:', requestBody);

            const response = await fetch(CONFIG.API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            console.log('Response status:', response.status);

            // 获取响应文本以便调试
            const responseText = await response.text();
            console.log('Raw response:', responseText);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}, message: ${responseText}`);
            }

            // 尝试解析JSON
            let data;
            try {
                data = JSON.parse(responseText);
            } catch (e) {
                throw new Error('Invalid JSON response from API');
            }

            if (!data.choices || !data.choices[0] || !data.choices[0].message) {
                console.error('Unexpected API response format:', data);
                throw new Error('Invalid response format from API');
            }

            return data.choices[0].message.content;
        } catch (error) {
            console.error('API调用详细错误:', error);
            throw new Error(`消息发送失败: ${error.message}`);
        }
    }
}

export default ChatAPI; 