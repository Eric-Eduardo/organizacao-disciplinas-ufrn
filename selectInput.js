let selectInputOpen = false;
document.querySelector('.selectInput .selectInput_clicker').addEventListener('click', () => {
    if (selectInputOpen) {
        document.querySelector('.selectInput .contentSelectInput').style.display = "none";
        document.querySelector('.selectInput .selectInput_clicker').innerHTML = "<i class='bx bx-chevron-down'></i> Selecionar matérias"
    } else {
        document.querySelector('.selectInput .contentSelectInput').style.display = "block";
        document.querySelector('.selectInput .selectInput_clicker').innerHTML = "<i class='bx bx-chevron-up'></i> Selecionar matérias"
    }

    selectInputOpen = !selectInputOpen;
})