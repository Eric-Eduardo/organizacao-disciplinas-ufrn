
var subjects = JSON.parse(localStorage.getItem("materiasHoraios@ufrn")) || [];
var timetablesSubjects;
var timeout_card;
var timeout_message_card;
const formSubject = document.querySelector("#form-subject form");
const formClass = document.querySelector("#form-class form");
const timeTable = document.getElementById("table-horarios");
const includeSaturdayCheck = document.getElementById("includeSaturdayCheck");
const substituteTimesCheck = document.getElementById("substituteTimesCheck");
let includeSaturday = false;
let substituteTimes = true;

view_subjects();
get_timetables();

includeSaturday ? includeSaturdayCheck.checked = true : includeSaturdayCheck.checked = false;
substituteTimes ? substituteTimesCheck.checked = true : substituteTimesCheck.checked = false;

document.getElementById("btn-add-subject").addEventListener('click', () => viewSubjectForm());
includeSaturdayCheck.addEventListener('click', () => {
    includeSaturday = includeSaturdayCheck.checked;
    update_timetables(timetablesSubjects);
})
substituteTimesCheck.addEventListener('click', () => {
    substituteTimes = substituteTimesCheck.checked;
    update_timetables(timetablesSubjects);
})

formSubject.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(formSubject);
    const name = formData.get('name');
    const code = formData.get('code');
    const workload = formData.get('workload');
    const idSubject = formData.get('idSubject');


    if (idSubject == null || idSubject == "") {
        let newSubject = {
            name: name.toUpperCase(),
            code: code.toUpperCase(),
            ch: workload,
            classes: []
        }
        subjects.push(newSubject);
    } else {
        subjects[Number(idSubject)].name = name;
        subjects[Number(idSubject)].code = code;
        subjects[Number(idSubject)].ch = workload;
    }

    formSubject.reset();

    view_subjects();
});

formClass.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(formClass);
    const location = formData.get('location');
    const timetable = formData.get('timetable');
    const professor = formData.get('professor');
    const idClasse = formData.get('idClasse');
    const idSubjectClasse = Number(formData.get('idSubjectClasse'));


    if (idClasse == null || idClasse == "") {
        let newClass = {
            location: location.toUpperCase(),
            professor: professor.toUpperCase(),
            timetable: timetable.toUpperCase().split(" ")
        }
        subjects[idSubjectClasse].classes.push(newClass);
    } else {
        subjects[idSubjectClasse].classes[idClasse].location = location;
        subjects[idSubjectClasse].classes[idClasse].timetable = timetable.toUpperCase().split(" ");
        subjects[idSubjectClasse].classes[idClasse].professor = professor;
    }

    formClass.reset();

    view_subjects();
});

formSubject.addEventListener('reset', () => {
    document.getElementById("form-subject").style.visibility = "hidden";
})


formClass.addEventListener('reset', () => {
    document.getElementById("form-class").style.visibility = "hidden";
})


document.querySelector('.btn-salvar').addEventListener('click', save);

function save() {
    localStorage.setItem("materiasHoraios@ufrn", JSON.stringify(subjects));

    show_agreed_card("Alterações salvas!");
}

function viewSubjectForm(id) {
    if (id != null) {
        let subject = subjects[id];
        document.getElementById('name').value = subject.name;
        document.getElementById('code').value = subject.code;
        document.getElementById('workload').value = subject.ch;
        document.getElementById('idSubject').value = id;
    }
    document.getElementById("form-subject").style.visibility = "visible";
}

function viewClassesForm(idClasse, idSubject) {
    document.getElementById('idSubjectClasse').value = idSubject;
    document.getElementById('idClasse').value = null;
    if (idClasse != null && idSubject != null) {
        let classe = subjects[idSubject].classes[idClasse];
        document.getElementById('location').value = classe.location;
        document.getElementById('timetable').value = classe.timetable.join(" ");
        document.getElementById('professor').value = classe.professor;
        document.getElementById('idClasse').value = idClasse;
    }
    document.getElementById("form-class").style.visibility = "visible";
    document.querySelector('#form-class h4').textContent = subjects[idSubject].name.toUpperCase();
}

function removeSubject(id) {
    subjects.splice(id, 1);
    view_subjects();
    show_agreed_card("Matéria removida!");
}

function removeClass(idClass, idSubject) {
    if (idClass != null && idSubject != null) {
        subjects[idSubject].classes.splice(idClass, 1);
        view_subjects();
        show_agreed_card("Turma removida!");
    } else {
        show_error_card("Não foi possível remover a turma!");
    }
}

function selectClass(idClass, idSubject) {
    let radioElement = document.getElementById(`class-${idClass}-${idSubject}`);
    let classe = subjects[idSubject].classes[idClass];
    let classSubject = subjects[idSubject].classes;
    // var idSubjects = subjects.filter(function (obj) { return obj['selecionada'] == true });
    for (let i = 0; i < classSubject.length; i++) {
        if (classSubject[i].selected && i != idClass) {
            subjects[idSubject].classes[i].selected = false;
            break;
        }
    }


    if (classe.selected) {
        classe.selected = false;
        radioElement.checked = false;
    } else {
        classe.selected = true;
        radioElement.checked = true;
    }
}

function view_subjects() {
    var tableBodyElement = document.querySelector('#table-disciplinas tbody');

    tableBodyElement.innerHTML = '';

    for (idc in subjects) {
        let subject = subjects[idc];
        let mergedLineElement = document.createElement('tr');

        mergedLineElement.className = "merged-line";

        mergedLineElement.innerHTML = `
        <td>
            <button id="btn-add-class" class="btn bg-blue" onclick="viewClassesForm(null, ${idc})">
                <i class='bx bx-plus'></i>
            </button>
        </td>
        <td>
            ${subject.code.toUpperCase()}
        </td>
        <td colspan="2">
        <span>${subject.name.toUpperCase()} (${subject.ch}h)</span>
        </td>
        <td>
            <button class="btn bg-red" onclick="removeSubject(${idc})">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-trash"
                    width="16" height="16" viewBox="0 0 24 24" stroke-width="2" stroke="#ffffff"
                    fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M4 7l16 0" />
                    <path d="M10 11l0 6" />
                    <path d="M14 11l0 6" />
                    <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                    <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                </svg>
            </button>
            <button class="btn bg-blue" onclick="viewSubjectForm(${idc})">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-pencil"
                    width="16" height="16" viewBox="0 0 24 24" stroke-width="2" stroke="#ffffff"
                    fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
                    <path d="M13.5 6.5l4 4" />
                </svg>
            </button>
        </td>
        `;

        tableBodyElement.appendChild(mergedLineElement);

        for (i in subject.classes) {
            let classeLineElement = document.createElement('tr');
            classeLineElement.className = "classe";
            let classe = subject.classes[i];

            classeLineElement.innerHTML = `
            <td><input type="radio" id="class-${i}-${idc}" name="subject-${idc}" onclick="selectClass(${i}, ${idc})" ${classe.selected ? "checked" : ""}></td>
            <td>${classe.timetable.join(' ')}</td>
            <td>${classe.professor.toUpperCase()}</td>
            <td>${classe.location.toUpperCase()}</td>
            <td>
                <button class="btn bg-red" onclick="removeClass(${i}, ${idc})">
                    <svg xmlns="http://www.w3.org/2000/svg"
                        class="icon icon-tabler icon-tabler-trash" width="16" height="16"
                        viewBox="0 0 24 24" stroke-width="2" stroke="#ffffff" fill="none"
                        stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M4 7l16 0" />
                        <path d="M10 11l0 6" />
                        <path d="M14 11l0 6" />
                        <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                        <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                    </svg>
                </button>
                <button class="btn bg-blue" onclick="viewClassesForm(${i}, ${idc})">
                    <svg xmlns="http://www.w3.org/2000/svg"
                        class="icon icon-tabler icon-tabler-pencil" width="16" height="16"
                        viewBox="0 0 24 24" stroke-width="2" stroke="#ffffff" fill="none"
                        stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
                        <path d="M13.5 6.5l4 4" />
                    </svg>
                </button>
            </td>
            `;
            tableBodyElement.appendChild(classeLineElement);
        }
    }
}

function get_selected_subjects() {
    var selectedSubjects = subjects.filter(function (obj) {
        for (classe of obj.classes) {
            if (classe.selected) return true
        }

        return false;
    });

    return selectedSubjects;
}

function get_timetables() {
    var selectedSubjects = get_selected_subjects();


    let map = [];

    for (i in selectedSubjects) {
        let classe = selectedSubjects[i].classes.find(function (obj) {
            return obj.selected;
        })

        map.push({ name: selectedSubjects[i].name, timetable: classe.timetable })

    }

    timetablesSubjects = new Map([
        ['M1',
            new Map([
                ['2', ''],
                ['3', ''],
                ['4', ''],
                ['5', ''],
                ['6', ''],
                ['7', ''],
                ['hora', '07:00 - 07:50'],
                ['vazio', 1],
            ])
        ],
        ['M2',
            new Map([
                ['2', ''],
                ['3', ''],
                ['4', ''],
                ['5', ''],
                ['6', ''],
                ['7', ''],
                ['hora', '07:50 - 08:40'],
                ['vazio', 1],
            ])
        ],
        ['M3',
            new Map([
                ['2', ''],
                ['3', ''],
                ['4', ''],
                ['5', ''],
                ['6', ''],
                ['7', ''],
                ['hora', '08:50 - 09:40'],
                ['vazio', 1],
            ])
        ],
        ['M4',
            new Map([
                ['2', ''],
                ['3', ''],
                ['4', ''],
                ['5', ''],
                ['6', ''],
                ['7', ''],
                ['hora', '09:40 - 10:30'],
                ['vazio', 1],
            ])
        ],
        ['M5',
            new Map([
                ['2', ''],
                ['3', ''],
                ['4', ''],
                ['5', ''],
                ['6', ''],
                ['7', ''],
                ['hora', '10:40 - 11:30'],
                ['vazio', 1],
            ])
        ],
        ['M6',
            new Map([
                ['2', ''],
                ['3', ''],
                ['4', ''],
                ['5', ''],
                ['6', ''],
                ['7', ''],
                ['hora', '11:30 - 12:20'],
                ['vazio', 1],
            ])
        ],
        ['T1',
            new Map([
                ['2', ''],
                ['3', ''],
                ['4', ''],
                ['5', ''],
                ['6', ''],
                ['7', ''],
                ['hora', '13:00 - 13:50'],
                ['vazio', 1],
            ])
        ],
        ['T2',
            new Map([
                ['2', ''],
                ['3', ''],
                ['4', ''],
                ['5', ''],
                ['6', ''],
                ['7', ''],
                ['hora', '13:50 - 14:40'],
                ['vazio', 1],
            ])
        ],
        ['T3',
            new Map([
                ['2', ''],
                ['3', ''],
                ['4', ''],
                ['5', ''],
                ['6', ''],
                ['7', ''],
                ['hora', '14:50 - 15:40'],
                ['vazio', 1],
            ])
        ],
        ['T4',
            new Map([
                ['2', ''],
                ['3', ''],
                ['4', ''],
                ['5', ''],
                ['6', ''],
                ['7', ''],
                ['hora', '15:40 - 16:30'],
                ['vazio', 1],
            ])
        ],
        ['T5',
            new Map([
                ['2', ''],
                ['3', ''],
                ['4', ''],
                ['5', ''],
                ['6', ''],
                ['7', ''],
                ['hora', '16:40 - 17:30'],
                ['vazio', 1],
            ])
        ],
        ['T6',
            new Map([
                ['2', ''],
                ['3', ''],
                ['4', ''],
                ['5', ''],
                ['6', ''],
                ['7', ''],
                ['hora', '17:30 - 18:20'],
                ['vazio', 1],
            ])
        ],
        ['N1',
            new Map([
                ['2', ''],
                ['3', ''],
                ['4', ''],
                ['5', ''],
                ['6', ''],
                ['7', ''],
                ['hora', '18:40 - 19:30'],
                ['vazio', 1],
            ])
        ],
        ['N2',
            new Map([
                ['2', ''],
                ['3', ''],
                ['4', ''],
                ['5', ''],
                ['6', ''],
                ['7', ''],
                ['hora', '19:30 - 20:20'],
                ['vazio', 1],
            ])
        ],
        ['N3',
            new Map([
                ['2', ''],
                ['3', ''],
                ['4', ''],
                ['5', ''],
                ['6', ''],
                ['7', ''],
                ['hora', '20:30 - 21:20'],
                ['vazio', 1],
            ])
        ],
        ['N4',
            new Map([
                ['2', ''],
                ['3', ''],
                ['4', ''],
                ['5', ''],
                ['6', ''],
                ['7', ''],
                ['hora', '21:20 - 22:10'],
                ['vazio', 1],
            ])
        ],
    ]);


    for (var subject of map) {
        for (var horario of subject.timetable) {
            var turno;
            var horarios;
            var dias;
            if (horario.indexOf('M') != -1) turno = 'M';
            else if (horario.indexOf('T') != -1) turno = 'T';
            else turno = 'N';

            var indexCaracTurn = horario.indexOf(turno);

            horarios = horario.slice(indexCaracTurn + 1).split('');
            dias = horario.slice(0, indexCaracTurn).split('');

            for (var hor of horarios) {
                for (var dia of dias) {
                    var materia = timetablesSubjects.get(turno + hor).get(dia);
                    if (materia != '') {
                        timetablesSubjects.get(turno + hor).set(dia, materia + ' && ' + subject.name);
                    } else {
                        timetablesSubjects.get(turno + hor).set(dia, subject.name);
                    }
                    timetablesSubjects.get(turno + hor).set('vazio', 0);
                }
            }
        }
    }

    update_timetables(timetablesSubjects);
    update_selected_classes_table();
}

function update_timetables(timetablesSubjects) {
    let conflito = false;
    const keys = timetablesSubjects.keys();
    clean_timetable();
    let numDays = includeSaturday ? 7 : 6;

    for (let key of keys) {

        const trElement = document.createElement('tr');
        trElement.id = key;
        substituteTimes ?
            trElement.innerHTML += `<td>${key}</td>` :
            trElement.innerHTML += `<td>${timetablesSubjects.get(key).get('hora')}</td>`;

        trElement.classList.add(`turno-${key[0]}`);



        for (var i = 2; i <= numDays; i++) {
            if (timetablesSubjects.get(key).get(`${i}`).indexOf('&&') > -1) {
                trElement.innerHTML += `<td class='conflict'>${timetablesSubjects.get(key).get(`${i}`).toUpperCase()}</td>`;
                conflito = true;
            } else {
                trElement.innerHTML += `<td>${timetablesSubjects.get(key).get(`${i}`).toUpperCase()}</td>`;
            }
        }

        if (key.toUpperCase() == "M6" || key.toUpperCase() == "T6") {
            trElement.classList.add("margin-bottom")
        }


        timeTable.appendChild(trElement);
    }

    conflito ? show_warning_card("Algumas matérias estão em conflito!") : ""
}

function clean_timetable() {
    if (includeSaturday) {
        timeTable.innerHTML = `<tr>
        <th style="width: ${substituteTimes ? "32px" : "90px"}">Hor.</th>
        <th>Segunda</th>
        <th>Terça</th>
        <th>Quarta</th>
        <th>Quinta</th>
        <th>Sexta</th>
        <th>Sábado</th>
        </tr>`;
    } else {
        timeTable.innerHTML = `<tr>
        <th style="width: ${substituteTimes ? "32px" : "90px"}">Hor.</th>
        <th>Segunda</th>
        <th>Terça</th>
        <th>Quarta</th>
        <th>Quinta</th>
        <th>Sexta</th>
        </tr>`
    }
}

function update_selected_classes_table() {
    var selectedSubjects = get_selected_subjects();

    let table = document.querySelector('#selected-classes tbody');
    table.innerHTML = "";
    for (let subject of selectedSubjects) {
        let trElement = document.createElement("tr");
        let classe = subject.classes.find(function (obj) {
            return obj.selected;
        });
        trElement.innerHTML = `
            <td>${subject.code}</td>
            <td>${subject.name.toUpperCase()}</td>
            <td>${classe.timetable.join(" ")}</td>
            <td>${classe.professor}</td>
            <td>${classe.location}</td>
            <td>${subject.ch}</td>
        `;

        table.appendChild(trElement);
    }


}