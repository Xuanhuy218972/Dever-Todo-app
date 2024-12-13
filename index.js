document.addEventListener('DOMContentLoaded', () => {
    const tasks = [...document.querySelectorAll('.task')];
    const taskArea = document.querySelector('.task-area');
    const levelSelect = document.querySelector('#level-select');
    const markSelect = document.querySelector('#mark-select');
    const sortSelect = document.querySelector('#sort-select');
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

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                levelFilter = button.id;
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                applyFilters();
            });
        });
    };

    initializeStars();
    initializeCheckboxes();
    initializeFilters();
});
