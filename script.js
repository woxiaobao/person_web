import ChatAPI from './api.js';

document.addEventListener('DOMContentLoaded', function() {
    const messagesArea = document.getElementById('messagesArea');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const errorMessage = document.getElementById('errorMessage');
    const sendIcon = document.querySelector('.send-icon');
    const loadingSpinner = document.querySelector('.loading-spinner');

    // 添加轮播功能
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;

    const dots = document.querySelectorAll('.dot');

    function updateDots() {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    // 每3秒切换一次图片
    setInterval(nextSlide, 3000);

    // 添加消息历史记录数组
    let messageHistory = [];

    function addMessage(content, isUser = true) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : 'ai'}`;

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = isUser ? 'YOU' : 'AI';

        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        if (isUser) {
            messageContent.textContent = content;
        } else {
            // 处理AI回复的Markdown格式
            messageContent.innerHTML = formatAIResponse(content);
        }

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
        messagesArea.appendChild(messageDiv);
        
        // 添加消息到历史记录
        messageHistory.push({
            role: isUser ? 'user' : 'assistant',
            content: content
        });

        // 滚动到最新消息
        messagesArea.scrollTop = messagesArea.scrollHeight;
    }

    function formatAIResponse(text) {
        // 处理加粗文本
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // 处理有序列表
        const lines = text.split('\n');
        let formatted = '';
        let inList = false;
        
        lines.forEach(line => {
            if (line.match(/^\d+\./)) {
                if (!inList) {
                    formatted += '<ol>';
                    inList = true;
                }
                formatted += `<li>${line.replace(/^\d+\.\s*/, '')}</li>`;
            } else {
                if (inList) {
                    formatted += '</ol>';
                    inList = false;
                }
                if (line.trim()) {
                    formatted += `<p>${line}</p>`;
                }
            }
        });
        
        if (inList) {
            formatted += '</ol>';
        }
        
        return formatted;
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 3000);
    }

    function toggleLoadingState(loading) {
        sendButton.disabled = loading;
        sendIcon.style.display = loading ? 'none' : 'block';
        loadingSpinner.style.display = loading ? 'block' : 'none';
    }

    async function sendMessage() {
        const message = messageInput.value.trim();
        if (!message) return;

        try {
            toggleLoadingState(true);
            addMessage(message, true);
            messageInput.value = '';

            console.log('发送消息历史:', messageHistory); // 调试日志

            const response = await ChatAPI.sendMessage(messageHistory);
            console.log('收到回复:', response); // 调试日志
            addMessage(response, false);
        } catch (error) {
            console.error('发送消息错误:', error);
            showError(error.message);
            // 从消息历史中移除失败的消息
            messageHistory.pop();
        } finally {
            toggleLoadingState(false);
        }
    }

    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // 添加点击导航点切换图片的功能
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (index !== currentSlide) {
                slides[currentSlide].classList.remove('active');
                dots[currentSlide].classList.remove('active');
                currentSlide = index;
                slides[currentSlide].classList.add('active');
                dots[currentSlide].classList.add('active');
            }
        });
    });
}); 