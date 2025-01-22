// 主题切换功能
const themeToggle = document.getElementById('themeToggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// 初始化主题
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.dataset.theme = savedTheme;
    } else if (prefersDarkScheme.matches) {
        document.documentElement.dataset.theme = 'dark';
    }
}

// 切换主题
function toggleTheme() {
    const currentTheme = document.documentElement.dataset.theme;
    const newTheme = currentTheme === 'dark' ? '' : 'dark';
    document.documentElement.dataset.theme = newTheme;
    localStorage.setItem('theme', newTheme);
}

// 返回顶部功能
const backToTop = document.getElementById('backToTop');

function toggleBackToTopButton() {
    if (window.scrollY > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// 轮播图触摸事件处理
let touchStartX = 0;
let touchEndX = 0;

function handleTouchStart(e) {
    touchStartX = e.touches[0].clientX;
}

function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].clientX;
    const diffX = touchEndX - touchStartX;
    
    if (Math.abs(diffX) > 50) { // 最小滑动距离
        if (diffX > 0) {
            // 向右滑动，显示上一张
            showPreviousSlide();
        } else {
            // 向左滑动，显示下一张
            showNextSlide();
        }
    }
}

// 轮播图切换逻辑
function showPreviousSlide() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const activeSlide = document.querySelector('.slide.active');
    const currentIndex = Array.from(slides).indexOf(activeSlide);
    const newIndex = (currentIndex - 1 + slides.length) % slides.length;
    
    activeSlide.classList.remove('active');
    slides[newIndex].classList.add('active');
    
    dots[currentIndex].classList.remove('active');
    dots[newIndex].classList.add('active');
}

function showNextSlide() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const activeSlide = document.querySelector('.slide.active');
    const currentIndex = Array.from(slides).indexOf(activeSlide);
    const newIndex = (currentIndex + 1) % slides.length;
    
    activeSlide.classList.remove('active');
    slides[newIndex].classList.add('active');
    
    dots[currentIndex].classList.remove('active');
    dots[newIndex].classList.add('active');
}

import { translations } from './i18n.js';

// 获取当前语言设置
let currentLang = localStorage.getItem('language') || 'zh';
document.documentElement.lang = currentLang;

// 更新页面文本
function updatePageText() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const keys = key.split('.');
        let value = translations[currentLang];
        for (const k of keys) {
            value = value[k];
        }
        if (value) element.textContent = value;
    });

    // 更新meta标签
    document.querySelector('meta[name="description"]').content = translations[currentLang].description;
    document.querySelector('meta[name="keywords"]').content = translations[currentLang].keywords;
    document.querySelector('meta[name="author"]').content = translations[currentLang].author;

    // 更新placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        element.placeholder = translations[currentLang][key];
    });
}

// 切换语言
function toggleLanguage() {
    currentLang = currentLang === 'zh' ? 'en' : 'zh';
    localStorage.setItem('language', currentLang);
    document.documentElement.lang = currentLang;
    updatePageText();
}

// 事件监听
document.addEventListener('DOMContentLoaded', () => {
    // 初始化主题
    initTheme();

    // 主题切换
    themeToggle.addEventListener('click', toggleTheme);

    // 初始化语言设置
    updatePageText();

    // 绑定语言切换按钮事件
    document.getElementById('languageToggle').addEventListener('click', toggleLanguage);

    // 返回顶部
    window.addEventListener('scroll', toggleBackToTopButton);
    backToTop.addEventListener('click', scrollToTop);

    // 监听系统主题变化
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            document.documentElement.dataset.theme = e.matches ? 'dark' : '';
        }
    });

    // 添加轮播图触摸事件监听
    const carousel = document.querySelector('.carousel');
    carousel.addEventListener('touchstart', handleTouchStart);
    carousel.addEventListener('touchend', handleTouchEnd);
});