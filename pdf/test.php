<?php 
    /* require_once __DIR__ . '/vendor/autoload.php';

    $defaultConfig = (new Mpdf\Config\ConfigVariables())->getDefaults();
    $fontDirs = $defaultConfig['fontDir'];

    $defaultFontConfig = (new Mpdf\Config\FontVariables())->getDefaults();
    $fontData = $defaultFontConfig['fontdata'];

    $mpdf = new \Mpdf\Mpdf([
        'mode' => 'UTF-8',
        'format' => [149.3, 244.5],
        'orientation' => 'P',
        'margin_left' => 0,
        'margin_right' => 0,
        'margin_top' => 0,
        'margin_bottom' => 0,
        'margin_header' => 0,
        'margin_footer' => 0,
        'tempDir' => __DIR__ . '/upload',
        'fontDir' => array_merge($fontDirs, [
            __DIR__ . '/fonts'
        ]),
        'fontdata' => $fontData + [
            'montserrat' => [
                'R' => 'Montserrat-Regular.ttf',
                'B' => 'Montserrat-Bold.ttf',
            ],
            'montserrat-bold' => [
                'R' => 'Montserrat-Regular.ttf',
                'B' => 'Montserrat-Bold.ttf',
            ]
        ],
        'default_font' => 'montserrat'
    ]);

    $mpdf->SetDisplayMode('fullpage');
    $mpdf->AddFontDirectory("fonts");
    $stylesheet = file_get_contents('styles.css');
    $mpdf->WriteHTML($stylesheet, 1);
    $mpdf->WriteHTML(file_get_contents('plantilla.html'));
    $mpdf->Output("phphtml.pdf", "I");  // D -> download, I -> En navegador */
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <link rel="shortcut icon" href=""/>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Title</title>
    <script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
    <link href="styles.css" rel="stylesheet">
    <!-- PDF's html2pdf -->
	<script src="dist/html2pdf.bundle.js"></script>
</head>
<body>
    <button id="generaPDF" onclick="generaPDF()">Generar PDF</button>
    <?php include("plantilla2.html"); ?>
<script>
    function generaPDF() {
        var element = document.getElementById('main');
        element.style.display = "block";
        let altura1 = $('#main').height();
        var altura = (altura1 + 0.825) * 0.2645833333;
        
        let ancho = $('#main').width() * 0.2645833333;
        
        //console.log(altura);
        var rotates = document.getElementsByClassName('rotate');
        //console.log(rotates);
        
        for (var i = 0; i < rotates.length; i++) {
            var parent = rotates[i].parentElement;            
            rotates[i].style.width = parent.offsetHeight + 'px';
        }
        // Generate the PDF.
        html2pdf().from(element).set({
        margin: [0, 0, 0, 0],
        filename: 'boletin-siat-ct.pdf',
        //mode: 'avoid-all',
        html2canvas: { scale: 5 }, // entre más alto mejor calidad tiene
        pagebreak: {mode:  ['avoid-all', 'css']},
        letterRendering: true,
        jsPDF: {orientation: 'portrait', unit: 'mm', format: [ancho, altura], compressPDF: false}}).toPdf().get('pdf').then(function (pdf) {
        
        //console.log("estoy creando el pdf");
        
        }).save().then( function(){
            console.log("estamos salvados");
            element.style.display = "none";
        });
    }
</script>

</body>
</html>