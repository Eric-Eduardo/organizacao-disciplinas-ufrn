function show_card(text, type) {

    const card = document.createElement('div');


    card.className = "toast";

    switch (type) {
        case "agreed":
            card.innerHTML = `<i class='bx bx-check'></i><p>${text}</p>`;
            card.style.backgroundColor = "#139dff";
            break;
        case "warning":
            card.innerHTML = `<i class='bx bxs-error'></i><p>${text}</p>`;
            card.style.backgroundColor = "#E7BD05";
            break;
        case "error":
            card.innerHTML = `<i class='bx bxs-error-alt'></i><p>${text}</p>`;
            card.style.backgroundColor = "#E53935";
            break;
    }

    let idCard = Date.now().toString();
    card.id = idCard;

    document.querySelector('.toasts-content').appendChild(card);

    setTimeout(() => {

        const cardElement = document.getElementById(idCard);

        cardElement.style.visibility = "visible";
        cardElement.style.opacity = "100%";
        cardElement.style.transform = "translate(0px, 0px)";

        setTimeout(() => {
            cardElement.style.visibility = "hidden";
            cardElement.style.opacity = "0%";
            // cardElement.style.transform = "translate(100%, 0px)";
        }, 5000);
    }, 100);
}

function show_agreed_card(text) {
    show_card(text, "agreed");
}
function show_warning_card(text) {
    show_card(text, "warning");
}
function show_error_card(text) {
    show_card(text, "error");
}
