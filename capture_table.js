function doCaptureTimetables() {
    html2canvas(document.getElementById('table-horarios')).then(function (canvas) {
        var a = document.createElement('a');
        a.id = 'elementA'
        a.href = canvas.toDataURL("image/png");
        a.download = "horarios_de_aula_ufrn.png";
        a.click();
    })
}

function doCaptureSelectedClasses() {
    html2canvas(document.getElementById('selected-classes')).then(function (canvas) {
        var a = document.createElement('a');
        a.id = 'elementA'
        a.href = canvas.toDataURL("image/png");
        a.download = "turmas_selecionadas_ufrn.png";
        a.click();
    })
}

async function doCaptureAll() {
    const element1 = document.getElementById('selected-classes');
    const element2 = document.getElementById('table-horarios');

    // Captura os dois elementos separadamente
    const canvas1 = await html2canvas(element1);
    const canvas2 = await html2canvas(element2);

    // Cria um novo canvas com altura suficiente para ambos
    const finalCanvas = document.createElement('canvas');
    const ctx = finalCanvas.getContext('2d');

    // Define a largura como a maior dos dois elementos e a altura como a soma das alturas
    const width = Math.max(canvas1.width, canvas2.width);
    const height = canvas1.height + canvas2.height + 25;

    finalCanvas.width = width;
    finalCanvas.height = height;

    // Desenha os dois canvas no finalCanvas
    ctx.drawImage(canvas1, 0, 0);
    ctx.drawImage(canvas2, 0, canvas1.height+25);

    // Converte o canvas final para imagem
    const image = finalCanvas.toDataURL("image/png");

    // Criar um link para download
    const link = document.createElement("a");
    link.href = image;
    link.download = "horarios_de_aula_ufrn.png";
    link.click();
}

function doCapture() {
    const captureAll = document.getElementById('includeSelectedClasses').checked == true;

    if (captureAll) {
        doCaptureAll();
    } else {
        doCaptureTimetables();
    }
}