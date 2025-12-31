<script lang="ts">
    import { fade } from 'svelte/transition';
    import { Calendar, Left, Right } from '@icon-park/svg';

    let { 
        value = $bindable(new Date().toISOString().split('T')[0]), 
        label = "" 
    } = $props();

    let showCalendar = $state(false);
    let date = $derived(new Date(value));
    
    let currentMonth = $state(new Date().getMonth());
    let currentYear = $state(new Date().getFullYear());

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    let calendarDays = $derived.by(() => {
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
        
        let result = [];
        
        // Previous month padding
        for (let i = firstDay - 1; i >= 0; i--) {
            result.push({ day: prevMonthDays - i, current: false, month: currentMonth - 1, year: currentYear });
        }
        
        // Current month
        for (let i = 1; i <= daysInMonth; i++) {
            result.push({ day: i, current: true, month: currentMonth, year: currentYear });
        }
        
        // Next month padding
        const remaining = 42 - result.length;
        for (let i = 1; i <= remaining; i++) {
            result.push({ day: i, current: false, month: currentMonth + 1, year: currentYear });
        }
        
        return result;
    });

    function selectDate(d: number, m: number, y: number) {
        const newDate = new Date(y, m, d);
        // Adjust for timezone to get YYYY-MM-DD
        const offset = newDate.getTimezoneOffset();
        const adjustedDate = new Date(newDate.getTime() - (offset * 60 * 1000));
        value = adjustedDate.toISOString().split('T')[0];
        showCalendar = false;
    }

    function nextMonth() {
        if (currentMonth === 11) {
            currentMonth = 0;
            currentYear++;
        } else {
            currentMonth++;
        }
    }

    function prevMonth() {
        if (currentMonth === 0) {
            currentMonth = 11;
            currentYear--;
        } else {
            currentMonth--;
        }
    }

    function isSelected(d: number, m: number, y: number) {
        const sel = new Date(value);
        return sel.getDate() === d && sel.getMonth() === m && sel.getFullYear() === y;
    }
</script>

<div class="datepicker-container">
    {#if label}
        <span class="label">{label}</span>
    {/if}
    
    <div class="input-wrapper">
        <input 
            type="text" 
            readonly 
            {value} 
            onclick={() => showCalendar = !showCalendar}
            placeholder="Select date..."
        />
        <div class="icon">
            {@html Calendar({ size: 18, strokeWidth: 2 })}
        </div>
    </div>

    {#if showCalendar}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="backdrop" onclick={() => showCalendar = false}></div>
        <div class="calendar" transition:fade={{ duration: 150 }}>
            <div class="calendar-header">
                <button onclick={prevMonth}>{@html Left({ size: 16 })}</button>
                <span>{monthNames[currentMonth]} {currentYear}</span>
                <button onclick={nextMonth}>{@html Right({ size: 16 })}</button>
            </div>
            <div class="calendar-grid">
                {#each days as day}
                    <div class="day-name">{day}</div>
                {/each}
                {#each calendarDays as { day, current, month, year }}
                    <button 
                        class="day-cell" 
                        class:other-month={!current}
                        class:selected={isSelected(day, month, year)}
                        onclick={() => selectDate(day, month, year)}
                    >
                        {day}
                    </button>
                {/each}
            </div>
        </div>
    {/if}
</div>

<style>
    .datepicker-container {
        position: relative;
        display: inline-flex;
        flex-direction: column;
        gap: 0.5rem;
        width: 100%;
        max-width: 240px;
    }

    .label {
        font-family: var(--font-serif);
        font-size: 0.9rem;
        color: var(--secondary-text);
    }

    .input-wrapper {
        position: relative;
        display: flex;
        align-items: center;
    }

    input {
        width: 100%;
        padding: 0.75rem 1rem;
        padding-right: 2.5rem;
        border: 1px solid var(--border-color);
        background: var(--panel-bg);
        color: var(--text-color);
        font-family: var(--font-sans);
        font-size: 1rem;
        cursor: pointer;
        outline: none;
    }

    .icon {
        position: absolute;
        right: 1rem;
        color: var(--secondary-text);
        pointer-events: none;
        display: flex;
        align-items: center;
    }

    .backdrop {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 100;
    }

    .calendar {
        position: absolute;
        top: 100%;
        left: 0;
        margin-top: 0.5rem;
        background: var(--panel-bg);
        border: 1px solid var(--border-color);
        box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        z-index: 101;
        padding: 1rem;
        width: 280px;
    }

    @media (max-width: 600px) {
        .calendar {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90vw;
            max-width: 320px;
        }
        .backdrop {
            background: var(--overlay-bg);
            backdrop-filter: blur(4px);
        }
    }

    .calendar-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        font-family: var(--font-serif);
    }

    .calendar-header button {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.5rem;
        color: var(--text-color);
    }

    .calendar-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 2px;
    }

    .day-name {
        text-align: center;
        font-size: 0.75rem;
        color: var(--secondary-text);
        padding: 0.5rem 0;
        font-family: var(--font-sans);
    }

    .day-cell {
        aspect-ratio: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        background: none;
        border: none;
        cursor: pointer;
        font-family: var(--font-sans);
        font-size: 0.85rem;
        color: var(--text-color);
        transition: all 0.2s;
    }

    .day-cell:hover {
        background: var(--hover-bg);
    }

    .day-cell.other-month {
        opacity: 0.3;
    }

    .day-cell.selected {
        background: var(--text-color);
        color: var(--bg-color);
    }
</style>