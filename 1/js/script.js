// DOM элементы
const themeToggle = document.getElementById('themeToggle');
const menuToggle = document.getElementById('menuToggle');
const navList = document.getElementById('navList');
const feedbackForm = document.getElementById('feedbackForm');
const formMessage = document.getElementById('formMessage');
const skillLevels = document.querySelectorAll('.skill-level');

// Переключение темы
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    const icon = themeToggle.querySelector('i');
    if (document.body.classList.contains('dark-mode')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        localStorage.setItem('theme', 'dark');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
        localStorage.setItem('theme', 'light');
    }
});

// Проверка сохраненной темы
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    const icon = themeToggle.querySelector('i');
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
}

// Мобильное меню
menuToggle.addEventListener('click', () => {
    navList.classList.toggle('active');
    
    const icon = menuToggle.querySelector('i');
    if (navList.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Закрытие меню при клике на ссылку
document.querySelectorAll('.nav-list a').forEach(link => {
    link.addEventListener('click', () => {
        navList.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });
});

// Анимация навыков при скролле
const animateSkillsOnScroll = () => {
    skillLevels.forEach(skill => {
        const level = skill.getAttribute('data-level');
        skill.style.width = `${level}%`;
    });
};

// Проверка видимости элементов
const isElementInViewport = (el) => {
    const rect = el.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.9 &&
        rect.bottom >= 0
    );
};

// Обработчик скролла для анимации
const handleScrollAnimation = () => {
    const skillsSection = document.querySelector('.skills');
    if (isElementInViewport(skillsSection)) {
        animateSkillsOnScroll();
        window.removeEventListener('scroll', handleScrollAnimation);
    }
};

// Запуск анимации при загрузке страницы, если секция уже видна
window.addEventListener('load', handleScrollAnimation);
window.addEventListener('scroll', handleScrollAnimation);

// Форма обратной связи
feedbackForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Простая валидация
    if (!name || !email || !message) {
        showFormMessage('Пожалуйста, заполните все поля', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showFormMessage('Пожалуйста, введите корректный email', 'error');
        return;
    }
    
    // Имитация отправки формы
    showFormMessage('Сообщение отправлено! Я свяжусь с вами в ближайшее время.', 'success');
    
    // Очистка формы
    feedbackForm.reset();
    
    // Скрытие сообщения через 5 секунд
    setTimeout(() => {
        formMessage.style.display = 'none';
    }, 5000);
});

// Валидация email
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Показать сообщение формы
const showFormMessage = (text, type) => {
    formMessage.textContent = text;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';
};

// Плавная прокрутка для якорных ссылок
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Анимация появления элементов при скролле
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.section, .project-card, .skill-category, .education-item');
    
    elements.forEach(element => {
        if (isElementInViewport(element)) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// Установка начальных стилей для анимации
document.querySelectorAll('.section, .project-card, .skill-category, .education-item').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
});

// Запуск анимации при загрузке и скролле
window.addEventListener('load', animateOnScroll);
window.addEventListener('scroll', animateOnScroll);