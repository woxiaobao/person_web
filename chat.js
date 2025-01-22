import ChatAPI from './api.js';

// 聊天功能相关的状态
let isLoading = false;
let chatHistory = [];

// 消息发送处理函数
async function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const messagesArea = document.getElementById('messagesArea');
    const errorMessage = document.getElementById('errorMessage');
    const message = messageInput.value.trim();

    if (!message || isLoading) return;

    try {
        // 显示加载状态
        isLoading = true;
        sendButton.classList.add('loading');
        errorMessage.textContent = '';

        // 添加用户消息到对话区域
        const userMessageElement = createMessageElement('user', message);
        messagesArea.appendChild(userMessageElement);
        messageInput.value = '';
        messagesArea.scrollTop = messagesArea.scrollHeight;

        // 添加用户消息到历史记录
        chatHistory.push({ role: 'user', content: message });

        // 调用API获取响应
        const response = await ChatAPI.sendMessage(chatHistory);

        // 添加AI响应到历史记录
        chatHistory.push({ role: 'assistant', content: response });

        // 添加AI响应到对话区域
        const aiMessageElement = createMessageElement('ai', response);
        messagesArea.appendChild(aiMessageElement);
        messagesArea.scrollTop = messagesArea.scrollHeight;

    } catch (error) {
        errorMessage.textContent = '发送消息失败，请重试';
        console.error('发送消息错误:', error);
    } finally {
        // 重置加载状态
        isLoading = false;
        sendButton.classList.remove('loading');
    }
}

// 创建消息元素
function createMessageElement(type, content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = type === 'user' ? '👤' : '🤖';

    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.textContent = content;

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(messageContent);

    return messageDiv;
}

// 初始化聊天功能
function initChat() {
    const sendButton = document.getElementById('sendButton');
    const messageInput = document.getElementById('messageInput');

    // 绑定发送按钮点击事件
    sendButton.addEventListener('click', sendMessage);

    // 绑定输入框回车事件
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
}

// 导出初始化函数
export { initChat };