document.addEventListener('DOMContentLoaded', () => {
    const strategies = document.querySelectorAll('.strategy-item');
    const progressBar = document.getElementById('progressBar');
    const triggerSelect = document.getElementById('triggerSelect');
    const totalStrategies = strategies.length;
    const storageKeyBase = 'dopamineResetTool_';

    // --- State Loading (from localStorage) ---
    function loadState() {
        let checkedCount = 0;
        strategies.forEach(item => {
            const strategyId = item.dataset.strategyId;
            const checkbox = item.querySelector('.strategy-checkbox');
            const textarea = item.querySelector('.notes-textarea');

            // Load checkbox state
            const isChecked = localStorage.getItem(`${storageKeyBase}${strategyId}_checked`) === 'true';
            checkbox.checked = isChecked;
            if (isChecked) {
                checkedCount++;
            }

            // Load notes
            const savedNotes = localStorage.getItem(`${storageKeyBase}${strategyId}_notes`);
            if (savedNotes) {
                textarea.value = savedNotes;
            }
        });
        updateProgressBar(checkedCount);
    }

    // --- Progress Bar ---
    function updateProgressBar(count = -1) {
        let checkedCount = count;
        if (checkedCount === -1) { // Recalculate if not provided
            checkedCount = document.querySelectorAll('.strategy-checkbox:checked').length;
        }
        const percentage = totalStrategies > 0 ? Math.round((checkedCount / totalStrategies) * 100) : 0;
        progressBar.style.width = `${percentage}%`;
        progressBar.textContent = `${checkedCount} / ${totalStrategies}`;
        progressBar.setAttribute('aria-valuenow', checkedCount);
    }

    // --- Event Listeners ---

    // Checkbox changes
    strategies.forEach(item => {
        const checkbox = item.querySelector('.strategy-checkbox');
        const strategyId = item.dataset.strategyId;

        checkbox.addEventListener('change', (event) => {
            localStorage.setItem(`${storageKeyBase}${strategyId}_checked`, event.target.checked);
            updateProgressBar();
        });

        // Prevent accordion toggle when clicking checkbox label area (technically the button)
        // Allow direct click on input itself
        checkbox.addEventListener('click', (event) => {
             event.stopPropagation(); // Stop click from bubbling to the button
        });
    });

    // Notes changes (save on blur)
    strategies.forEach(item => {
        const textarea = item.querySelector('.notes-textarea');
        const strategyId = item.dataset.strategyId;
        textarea.addEventListener('blur', (event) => {
            localStorage.setItem(`${storageKeyBase}${strategyId}_notes`, event.target.value);
        });
    });

    // Quiz answer toggle
    document.querySelectorAll('.quiz-toggle').forEach(button => {
        button.addEventListener('click', () => {
            const answer = button.nextElementSibling; // Assumes answer <p> is immediately after button
            if (answer && answer.classList.contains('quiz-answer')) {
                answer.classList.toggle('d-none');
                button.textContent = answer.classList.contains('d-none') ? 'Show Answer' : 'Hide Answer';
            }
        });
    });

    // Trigger Filter
    triggerSelect.addEventListener('change', (event) => {
        const selectedTrigger = event.target.value;

        strategies.forEach(item => {
            item.classList.remove('highlight-relevant', 'filtered-out'); // Reset classes
            const itemTriggers = item.dataset.triggers ? JSON.parse(item.dataset.triggers) : [];

            if (selectedTrigger === 'all') {
                // Show all
            } else if (itemTriggers.includes(selectedTrigger)) {
                item.classList.add('highlight-relevant'); // Highlight matching
            } else {
                item.classList.add('filtered-out'); // Fade out non-matching
            }
        });
    });


    // --- Initial Load ---
    loadState();

});
