
let allCombinationsOfSubjects = [];
let currentIndexSubject = 0;
let selectedSubjectsFilter = [];
let shiftFilter = []; // Contém os turnos em que não deve ter matérias
let minNumSubjects = 3;
let maxNumSubjects = 6;


document.querySelector('.filters .confirmFilter').addEventListener('click', () => {
    minNumSubjects = Number(document.getElementById('minNumberSubjects').value);
    maxNumSubjects = Number(document.getElementById('maxNumberSubjects').value);

    console.log(minNumSubjects, maxNumSubjects);
    if (minNumSubjects > maxNumSubjects) {
        show_error_card("Não foi encontrado uma combinação que satisfaz os filtros");
        return;
    } 
    getShiftFilters();
    allCombinationsOfSubjects = [];
    getCombinationsSubjects(subjects, minNumSubjects, maxNumSubjects);

    if (allCombinationsOfSubjects.length == 0) {
        show_error_card("Não foi encontrado uma combinação que satisfaz os filtros");
    } else {
        selectClasses(currentIndexSubject);
        document.querySelector('#automaticSelectionCaroussel .total-pages-indicator').innerText = allCombinationsOfSubjects.length;
        document.querySelector("#automaticSelectionCaroussel .current-page-indicator").innerText = currentIndexSubject+1;
    }
})

document.getElementById('automaticSelectionCheck').addEventListener("click", () => {
    if (document.getElementById('automaticSelectionCheck').checked) {
        document.querySelector('.filters .hidden').style.display = "block";
        document.querySelector("#automaticSelectionCaroussel .current-page-indicator").innerText = 0;
        document.querySelector("#automaticSelectionCaroussel .total-pages-indicator").innerText = allCombinationsOfSubjects.length;
    } else {
        document.querySelector('.filters .hidden').style.display = "none";
    }
});

document.querySelector('#automaticSelectionCaroussel .next').addEventListener('click', () => {
    if (allCombinationsOfSubjects.length > 0) {
        allCombinationsOfSubjects.length > 0 ? currentIndexSubject = (currentIndexSubject + 1) % allCombinationsOfSubjects.length : currentIndexSubject = 0;
        selectClasses(currentIndexSubject);

        document.querySelector("#automaticSelectionCaroussel .current-page-indicator").innerText = currentIndexSubject + 1;
    }
})

document.querySelector('#automaticSelectionCaroussel .previous').addEventListener('click', () => {
    if (allCombinationsOfSubjects.length > 0) {

        if (currentIndexSubject == 0) currentIndexSubject = allCombinationsOfSubjects.length;
        allCombinationsOfSubjects.length > 0 ? currentIndexSubject = (currentIndexSubject - 1) % allCombinationsOfSubjects.length : currentIndexSubject = 0;
        selectClasses(currentIndexSubject);


        document.querySelector("#automaticSelectionCaroussel .current-page-indicator").innerText = currentIndexSubject + 1;
    }
})


function getShiftFilters() {
    shiftFilter = [];
    if (!document.getElementById('morningShiftCheckbox').checked) shiftFilter.push("M");
    if (!document.getElementById('afternoonShiftCheckbox').checked) shiftFilter.push("T");
    if (!document.getElementById('nightShiftCheckbox').checked) shiftFilter.push("N");
    console.log(shiftFilter);
}

function hasConflict(listTimetables) {
    let listSeparateItems = [];
    let separateItem = [];
    for (let time of listTimetables) {
        separateItem = separateTimetables(time);
        for (let item of listSeparateItems) {
            if (separateItem.find((element) => element == item) != null) {
                return true;
            }
        }
        listSeparateItems = listSeparateItems.concat(separateItem);
    }
    return false;
}

function separateTimetables(timetable) {
    let listSeparateItems = [];
    for (let item of timetable.split(' ')) {
        for (let shift of ["M", "T", "N"]) {
            if (item.indexOf(shift) > 0) {
                let day_time = item.split(shift);
                day_time[0].split('').map((day) => {
                    day_time[1].split('').map((time) => {
                        listSeparateItems.push(`${day}${shift}${time}`);
                    });
                });
                break;
            }
        }
    }
    return listSeparateItems;
}

function filterCombinationSubjects() {
    if (selectedSubjectsFilter.length > 0) {
        allCombinationsOfSubjects.filter((element) =>
            selectedSubjectsFilter.every(num => element.map(subarray => subarray[0]).includes(num))
        )
    }

    // console.log(allCombinationsOfSubjects);
}

function getCombinationsSubjects(arr, minSize, maxSize) {
    console.log(minSize, maxSize);
    function combine(prefix, start) {
        if (prefix.length >= minSize && prefix.length <= maxSize) {
            // result.push(prefix);
            if (selectedSubjectsFilter.every(num => prefix.includes(num))) {
                getCombinationsClasses(prefix);
            }
            // console.log("Testando [", prefix.toString(), "] ", selectedSubjectsFilter.every(num => prefix.includes(num)));
            // console.log(prefix);
        }
        if (prefix.length < maxSize) {
            for (let i = start; i < arr.length; i++) {
                combine([...prefix, i], i + 1);
            }
        }
    }

    let result = [];
    combine([], 0);
    // console.log("Oxi");
    // filterCombinationSubjects();
    // return result;
}
function getCombinationsClasses(groups) {
    function combine(index, prefix) {
        if (index === groups.length) {
            let timetablesList = prefix.map((element) => subjects[element[0]].classes[element[1]].timetable.join(' '));
            if (shiftFilter.every((item) => !timetablesList.join('').includes(item))) {
                if (!hasConflict(timetablesList))
                    allCombinationsOfSubjects.push(prefix);
                return;
            } else {
                return;
            }
        }
        for (let item in subjects[groups[index]].classes) {
            combine(index + 1, [...prefix, [groups[index], Number(item)]]);
        }
    }

    combine(0, []);
}

// Seleciona um conjunto de turmas de allCombinationsOfSubjects
function selectClasses(index) {
    resetSubjects();
    for (let [indexSubject, indexClass] of allCombinationsOfSubjects[index]) {
        subjects[indexSubject].classes[indexClass].selected = true;
    }
    view_subjects();
    get_timetables();
}

function resetSubjects() {
    for (let subject of subjects) {
        for (let classe of subject.classes) {
            classe.selected = false;
        }
    }
}

for (i in subjects) {
    const liElement = document.createElement('li');
    const buttonElement = document.createElement('button');
    const spanElement = document.createElement('span');

    spanElement.innerText = `${subjects[i].code} ${subjects[i].name} (${subjects[i].ch}h)`;

    if (selectedSubjectsFilter.includes(i)) {
        buttonElement.className = "remove";
        buttonElement.innerHTML = "<i class='bx bx-minus'></i>"
    } else {
        buttonElement.className = 'add';
        buttonElement.innerHTML = "<i class='bx bx-plus' ></i>";
    }

    buttonElement.dataset.idSubject = i;

    buttonElement.addEventListener('click', () => {

        if (selectedSubjectsFilter.includes(Number(buttonElement.dataset.idSubject))) {
            selectedSubjectsFilter = selectedSubjectsFilter.filter(item => item != Number(buttonElement.dataset.idSubject));
            buttonElement.className = 'add';
            buttonElement.innerHTML = "<i class='bx bx-plus' ></i>";
        } else {
            selectedSubjectsFilter.push(Number(buttonElement.dataset.idSubject));
            buttonElement.className = "remove";
            buttonElement.innerHTML = "<i class='bx bx-minus'></i>"
        }
    })

    liElement.appendChild(buttonElement);
    liElement.appendChild(spanElement);

    document.querySelector('.selectInput .contentSelectInput ul').appendChild(liElement);
}