document.addEventListener('DOMContentLoaded', function() {
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    const monthYearElement = document.getElementById('month-year');
    const calendarBody = document.getElementById('calendar-body');
    const prevMonthButton = document.getElementById('prev-month');
    const nextMonthButton = document.getElementById('next-month');

    prevMonthButton.addEventListener('click', showPreviousMonth);
    nextMonthButton.addEventListener('click', showNextMonth);

    function showPreviousMonth() {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
    }

    function showNextMonth() {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
    }

    const HolidayUtil = (function() {
        function getLunarFestival(date) {
            try {
                if (typeof Lunar === 'undefined') return null;

                const lunar = Lunar.fromDate(date);
                const festivals = lunar.getFestivals();
                if (festivals && festivals.length > 0) {
                    return {
                        name: festivals[0],
                        type: 'lunar',
                        important: true
                    };
                }

                const jieQi = lunar.getJieQi();
                if (jieQi) {
                    return {
                        name: jieQi,
                        type: 'solarTerm',
                        important: false
                    };
                }
            } catch (e) {
                console.error("获取农历节日出错:", e);
            }
            return null;
        }

        function getSolarFestival(date) {
            const month = date.getMonth() + 1;
            const day = date.getDate();

            const festivals = {
                "1-1": { name: "元旦", type: "fixed", important: true },
                "2-14": { name: "情人节", type: "fixed", important: false },
                "3-8": { name: "妇女节", type: "fixed", important: false },
                "4-1": { name: "愚人节", type: "fixed", important: false },
                "5-1": { name: "劳动节", type: "fixed", important: true },
                "6-1": { name: "儿童节", type: "fixed", important: false },
                "10-1": { name: "国庆节", type: "fixed", important: true },
                "10-2": { name: "国庆节", type: "fixed", important: true },
                "10-3": { name: "国庆节", type: "fixed", important: true },
                "12-25": { name: "圣诞节", type: "fixed", important: false }
            };

            const key = `${month}-${day}`;
            return festivals[key] || null;
        }

        function getHolidaysForDate(date) {
            const solarFestival = getSolarFestival(date);
            if (solarFestival && solarFestival.important) {
                return solarFestival;
            }

            const lunarFestival = getLunarFestival(date);
            if (lunarFestival && lunarFestival.important) {
                return lunarFestival;
            }

            return lunarFestival || solarFestival;
        }

        return {
            getHolidaysForDate: getHolidaysForDate
        };
    })();

    function renderCalendar() {
        calendarBody.innerHTML = '';

        const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
        monthYearElement.textContent = `${currentYear}年 ${monthNames[currentMonth]}`;

        const firstDay = new Date(currentYear, currentMonth, 1);
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const firstDayIndex = firstDay.getDay();
        const prevDaysCount = new Date(currentYear, currentMonth, 0).getDate();

        let date = 1;
        let nextMonthDate = 1;

        for (let i = 0; i < 6; i++) {
            const row = document.createElement('tr');

            for (let j = 0; j < 7; j++) {
                const cell = document.createElement('td');

                if (i === 0 && j < firstDayIndex) {
                    const prevDate = prevDaysCount - (firstDayIndex - j - 1);

                    const dateContainer = document.createElement('div');
                    dateContainer.classList.add('date-container');

                    const solarDate = document.createElement('div');
                    solarDate.textContent = prevDate;
                    solarDate.classList.add('solar-date');

                    dateContainer.appendChild(solarDate);

                    try {
                        if (typeof Lunar !== 'undefined') {
                            let prevMonth = currentMonth - 1;
                            let prevYear = currentYear;
                            if (prevMonth < 0) {
                                prevMonth = 11;
                                prevYear--;
                            }

                            const lunarDate = Lunar.fromDate(new Date(prevYear, prevMonth, prevDate));
                            const lunarElement = document.createElement('div');
                            lunarElement.textContent = lunarDate.getDayInChinese();
                            lunarElement.classList.add('lunar-date');

                            dateContainer.appendChild(lunarElement);
                        }
                    } catch (e) {
                        console.error('上个月农历转换错误:', e);
                    }

                    cell.appendChild(dateContainer);
                    cell.classList.add('other-month');
                } else if (date > daysInMonth) {
                    const dateContainer = document.createElement('div');
                    dateContainer.classList.add('date-container');

                    const solarDate = document.createElement('div');
                    solarDate.textContent = nextMonthDate;
                    solarDate.classList.add('solar-date');

                    dateContainer.appendChild(solarDate);

                    try {
                        if (typeof Lunar !== 'undefined') {
                            let nextMonth = currentMonth + 1;
                            let nextYear = currentYear;
                            if (nextMonth > 11) {
                                nextMonth = 0;
                                nextYear++;
                            }

                            const lunarDate = Lunar.fromDate(new Date(nextYear, nextMonth, nextMonthDate));
                            const lunarElement = document.createElement('div');
                            lunarElement.textContent = lunarDate.getDayInChinese();
                            lunarElement.classList.add('lunar-date');

                            dateContainer.appendChild(lunarElement);
                        }
                    } catch (e) {
                        console.error('下个月农历转换错误:', e);
                    }

                    cell.appendChild(dateContainer);
                    cell.classList.add('other-month');

                    nextMonthDate++;
                } else {
                    const dateContainer = document.createElement('div');
                    dateContainer.classList.add('date-container');

                    const solarDate = document.createElement('div');
                    solarDate.textContent = date;
                    solarDate.classList.add('solar-date');

                    dateContainer.appendChild(solarDate);

                    try {
                        if (typeof Lunar !== 'undefined') {
                            const lunarDate = Lunar.fromDate(new Date(currentYear, currentMonth, date));

                            const lunarElement = document.createElement('div');
                            lunarElement.textContent = lunarDate.getDayInChinese();
                            lunarElement.classList.add('lunar-date');

                            dateContainer.appendChild(lunarElement);

                            const festivals = lunarDate.getFestivals();
                            if (festivals && festivals.length > 0) {
                                const holidayElement = document.createElement('div');
                                holidayElement.textContent = festivals[0];
                                holidayElement.classList.add('holiday-date', 'lunar-holiday');
                                dateContainer.appendChild(holidayElement);
                                cell.classList.add('holiday');
                            }
                        }

                        const thisDate = new Date(currentYear, currentMonth, date);
                        const holiday = HolidayUtil.getHolidaysForDate(thisDate);

                        if (holiday && !dateContainer.querySelector('.holiday-date')) {
                            const holidayElement = document.createElement('div');
                            holidayElement.textContent = holiday.name;
                            holidayElement.classList.add('holiday-date', `${holiday.type}-holiday`);
                            dateContainer.appendChild(holidayElement);
                            cell.classList.add('holiday');
                        }
                    } catch (e) {
                        console.error(`渲染日期 ${currentYear}-${currentMonth+1}-${date} 出错:`, e);
                    }

                    cell.appendChild(dateContainer);

                    if (date === currentDate.getDate() &&
                        currentMonth === currentDate.getMonth() &&
                        currentYear === currentDate.getFullYear()) {
                        cell.classList.add('today');
                    }

                    date++;
                }

                row.appendChild(cell);
            }

            calendarBody.appendChild(row);

            if (date > daysInMonth) {
                break;
            }
        }
    }

    renderCalendar();

    monthYearElement.addEventListener('click', showDatePicker);

    function showDatePicker() {
        const modal = document.createElement('div');
        modal.classList.add('date-picker-modal');

        const pickerContainer = document.createElement('div');
        pickerContainer.classList.add('date-picker-container');

        const title = document.createElement('h3');
        title.textContent = '选择日期';
        pickerContainer.appendChild(title);

        const yearLabel = document.createElement('label');
        yearLabel.textContent = '年份：';
        const yearSelect = document.createElement('select');

        const thisYear = new Date().getFullYear();
        for (let year = thisYear - 10; year <= thisYear + 10; year++) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year + '年';
            if (year === currentYear) {
                option.selected = true;
            }
            yearSelect.appendChild(option);
        }

        yearLabel.appendChild(yearSelect);
        pickerContainer.appendChild(yearLabel);

        const monthLabel = document.createElement('label');
        monthLabel.textContent = '月份：';
        const monthSelect = document.createElement('select');

        const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
        for (let i = 0; i < 12; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = monthNames[i];
            if (i === currentMonth) {
                option.selected = true;
            }
            monthSelect.appendChild(option);
        }

        monthLabel.appendChild(monthSelect);
        pickerContainer.appendChild(monthLabel);

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('picker-buttons');

        const confirmButton = document.createElement('button');
        confirmButton.textContent = '确定';
        confirmButton.addEventListener('click', function() {
            const selectedYear = parseInt(yearSelect.value);
            const selectedMonth = parseInt(monthSelect.value);

            document.body.removeChild(modal);

            updateCalendarDate(selectedYear, selectedMonth);
        });

        buttonContainer.appendChild(confirmButton);

        const cancelButton = document.createElement('button');
        cancelButton.textContent = '取消';
        cancelButton.addEventListener('click', function() {
            document.body.removeChild(modal);
        });

        buttonContainer.appendChild(cancelButton);
        pickerContainer.appendChild(buttonContainer);

        modal.appendChild(pickerContainer);

        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });

        document.body.appendChild(modal);
    }

    function updateCalendarDate(year, month) {
        currentYear = year;
        currentMonth = month;
        renderCalendar();
    }
});
