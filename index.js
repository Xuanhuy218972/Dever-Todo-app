document.addEventListener('DOMContentLoaded', () => {
    const tasks = [...document.querySelectorAll('.task')];
    const taskArea = document.querySelector('.task-area');
    const levelSelect = document.querySelector('#level-select');
    const markSelect = document.querySelector('#mark-select');
    const sortSelect = document.querySelector('#sort-select');
    
    const addButton = document.querySelector('#add-button');
    const inputField = document.querySelector('#input-field');
    const filterButtons = document.querySelectorAll('.filter-button');
    let levelFilter = 'all';
    let markFilter = 'all';

    const getTaskLevel = (task) => {
        if (task.id.includes('easy')) return 'easy';
        if (task.id.includes('normal')) return 'normal';
        if (task.id.includes('hard')) return 'hard';
        return '';
    };

    const applyFilters = () => {
        tasks.forEach(task => {
            const isStarred = task.dataset.starred === 'true';
            const taskLevel = getTaskLevel(task);

            const levelMatch = levelFilter === 'all' || levelFilter === taskLevel;
            const markMatch = markFilter === 'all' ||
                (markFilter === 'danh-dau' && isStarred) ||
                (markFilter === 'none' && !isStarred);

            task.style.display = (levelMatch && markMatch) ? 'flex' : 'none';
        });
    };

    const sortTasks = (order) => {
        tasks.sort((a, b) => {
            const textA = a.querySelector('span').innerText.toLowerCase();
            const textB = b.querySelector('span').innerText.toLowerCase();
            return order === 'ascending' ? textA.localeCompare(textB) : textB.localeCompare(textA);
        }).forEach(task => taskArea.appendChild(task));
    };

    const toggleStar = (star) => {
        const isChecked = star.getAttribute('data-checked') === 'true';
        star.setAttribute('data-checked', isChecked ? 'false' : 'true');
        star.classList.toggle('checked', !isChecked);
        star.innerHTML = isChecked ? '&#xf006;' : '&#xf005;';

        const task = star.closest('.task');
        task.dataset.starred = star.getAttribute('data-checked');
        applyFilters();
    };

    const initializeStars = () => {
        tasks.forEach(task => {
            const star = task.querySelector('.star');
            task.dataset.starred = star.getAttribute('data-checked') === 'true';
            star.addEventListener('click', () => toggleStar(star));
        });
    };

    const initializeCheckboxes = () => {
        tasks.forEach(task => {
            const checkbox = task.querySelector('input[type="checkbox"]');
            const span = task.querySelector('span');

            checkbox.addEventListener('change', () => {
                span.classList.toggle('completed', checkbox.checked);
                span.style.color = checkbox.checked ? 'gray' : '';
            });
        });
    };

    const initializeFilters = () => {
        levelSelect.addEventListener('change', (e) => {
            levelFilter = e.target.value;
            applyFilters();
        });

        markSelect.addEventListener('change', (e) => {
            markFilter = e.target.value;
            applyFilters();
        });

        sortSelect.addEventListener('change', (e) => {
            const order = e.target.value === 'tang-dan' ? 'ascending' : 'descending';
            sortTasks(order);
        });
    };
    let currentDifficulty = 'normal'; 

    const updateDifficultySelection = (selectedButton) => {
        filterButtons.forEach(button => button.classList.remove('active'));
        selectedButton.classList.add('active');
        currentDifficulty = selectedButton.id;
    };

    filterButtons.forEach(button => {
        button.addEventListener('click', () => updateDifficultySelection(button));
    });

    const createTaskElement = (text, level) => {
        const task = document.createElement('div');
        task.className = 'task';
        task.id = `${level}-task`;
        task.dataset.status = 'todo';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';

        const span = document.createElement('span');
        span.className = level === 'easy' ? 'con' : level === 'normal' ? 'con1' : 'con2';
        span.textContent = text;

        const star = document.createElement('div');
        star.className = 'star';
        star.dataset.checked = 'false';
        star.innerHTML = '&#xf006;';
        star.addEventListener('click', () => toggleStar(star));

        checkbox.addEventListener('change', () => {
            span.classList.toggle('completed', checkbox.checked);
            span.style.color = checkbox.checked ? 'gray' : '';
        });

        task.appendChild(checkbox);
        task.appendChild(span);
        task.appendChild(star);

        return task;
    };

    const addTask = () => {
        const taskText = inputField.value.trim();
        if (taskText === '') {
            alert('Please enter a task.');
            return;
        }

        const newTask = createTaskElement(taskText, currentDifficulty);
        taskArea.appendChild(newTask);
        tasks.push(newTask);
        inputField.value = '';
    };

    addButton.addEventListener('click', addTask);

    inputField.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addTask();
        }
    });

    updateDifficultySelection(document.querySelector('#normal')); 
    initializeStars();
    initializeCheckboxes();
    initializeFilters();
});

