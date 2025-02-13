function doCapture() {
    html2canvas(document.getElementById('table-horarios')).then(function(canvas) {
        var a = document.createElement('a');
        a.id = 'elementA'
        a.href = canvas.toDataURL("image/png");
        a.download = "horarios_de_aula_ufrn.png";
        a.click();
    })
}