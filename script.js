function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.classList.add('hide-loader');
}

async function fetchDailyQuote() {
    try {
        const response = await fetch('https://api.xygeng.cn/one');
        const data = await response.json();
        if (data.code === 200) {
            return {
                content: data.data.content
            };
        } else {
            throw new Error('API response was not successful');
        }
    } catch (error) {
        console.error('Error fetching daily quote:', error);
        return {
            content: '生活就像一盒巧克力，你永远不知道下一颗是什么味道。'
        };
    }
}

// 修改 typeWriter 函数以适应新的格式
function typeWriter(quoteData, element, speed = 50) {
    let text = `${quoteData.content}`;
    element.innerHTML = text; // 立即设置全部文本
    element.style.opacity = '0'; // 初始设置为不可见
    let i = 0;
    function type() {
        if (i < text.length) {
            element.style.opacity = '1'; // 开始显示文本
            element.innerHTML = text.substring(0, i + 1);
            i++;
            setTimeout(type, speed);
        } else {
            if (element.classList.contains('daily-quote')) {
                element.classList.add('typewriter');
            }
        }
    }
    type();
}

async function setBackgroundImage() {
    const backgroundContainer = document.getElementById('background-container');
    if (backgroundContainer) {
        try {
            const response = await fetch('https://api.gumengya.com/Api/FjImg?format=image');
            if (response.ok) {
                const imageUrl = response.url;
                backgroundContainer.style.backgroundImage = `url("${imageUrl}")`;
                console.log('Background image set successfully');
            } else {
                throw new Error('Failed to fetch image');
            }
        } catch (error) {
            console.error('Error setting background image:', error);
            // 设置一个默认的背景图片或颜色
            backgroundContainer.style.backgroundColor = '#f0f0f0';
        }
    } else {
        console.error('Background container not found');
    }
}

function updateDateTime() {
    const now = new Date();
    const fullDateElement = document.querySelector('.full-date');
    const timeElement = document.querySelector('.time');

    if (fullDateElement && timeElement) {
        const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        const dayOfWeek = days[now.getDay()];

        const fullDateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        const dateString = now.toLocaleDateString('zh-CN', fullDateOptions);
        fullDateElement.textContent = `${dateString} ${dayOfWeek}`;

        timeElement.textContent = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } else {
        console.error('One or more time elements not found');
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const themeToggle = document.getElementById('theme-toggle');
    if (document.body.classList.contains('dark-mode')) {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', 'dark');
    } else {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem('theme', 'light');
    }
}

function setThemePreference() {
    const savedTheme = localStorage.getItem('theme');
    const themeToggle = document.getElementById('theme-toggle');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
}

function showWelcomeMessage() {
    const welcomeMessage = document.getElementById('welcome-message');
    welcomeMessage.classList.add('show');
    
    // 5秒后隐藏欢迎语
    setTimeout(() => {
        welcomeMessage.style.transform = 'translateX(-50%) translateY(-100px)';
        welcomeMessage.style.opacity = '0';
        
        // 等待过渡效果完成后移除 'show' 类
        setTimeout(() => {
            welcomeMessage.classList.remove('show');
            // 重置样式以便下次显示
            welcomeMessage.style.transform = '';
            welcomeMessage.style.opacity = '';
        }, 500);
    }, 5000);
}

document.addEventListener('DOMContentLoaded', async function() {
    async function initializePage() {
        updateDateTime();
        setInterval(updateDateTime, 1000);
        
        await setBackgroundImage();
        
        setPersonalMotto();
        
        const quoteElement = document.querySelector('.daily-quote');
        const quoteData = await fetchDailyQuote();
        typeWriter(quoteData, quoteElement);
        
        setThemePreference();
        
        const themeToggle = document.getElementById('theme-toggle');
        themeToggle.addEventListener('click', toggleTheme);
    }

    await initializePage();

    hideLoadingScreen();

    showWelcomeMessage();
});

function setPersonalMotto() {
    const mottoElement = document.querySelector('.motto');
    const motto = "挑战自我，超越极限，成为更好的自己"; // 您可以替换为您喜欢的名言
    typeWriter({ content: motto }, mottoElement, 100); // 使用较慢的打字速度
}