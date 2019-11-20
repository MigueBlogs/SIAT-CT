<?php 
    header('Content-Type: application/json');

    $response = array();
    $uploaded = array();
    $errors = array();

    function url_slug($str){	
        #convert case to lower
        $str = strtolower($str);
        #remove special characters
        $str = preg_replace('/[^a-zA-Z0-9]/i',' ', $str);
        #remove white space characters from both side
        $str = trim($str);
        #remove double or more space repeats between words chunk
        $str = preg_replace('/\s+/', ' ', $str);
        #fill spaces with hyphens
        $str = preg_replace('/\s+/', '', $str);
        return $str;
    }

    if(!empty($_FILES['file']['name'][0])){
        foreach($_FILES['file']['name'] as $position => $name){
            $file_ext=strtolower(end(explode('.',$name)));
	        $file_size = $_FILES["file"]["size"][$position];
            $expensions= array("kmz", "kml", "csv", "zip", "jpg", "jpeg", "png");
      
            if(in_array($file_ext,$expensions)=== false){
                $errors[]="Extensión de archivo no válida.";
            }
            
            if($file_size > 9282862) {
                $errors[]='Archivo máximo de 9MB';
            }
            
            if(empty($errors)==true) {
                $fecha = new DateTime();
                $timestamp = $fecha->getTimestamp();

                $fileNameParts = explode('.',$name);
                array_pop($fileNameParts);

                $fileName = $timestamp.implode("", $fileNameParts);
                if(move_uploaded_file($_FILES['file']['tmp_name'][$position], '/var/www/html/uploads/SIATCT/'.url_slug($fileName).".".$file_ext)){
                    $uploaded[] = array(
                        'name' => url_slug($fileName).".".$file_ext,
                        'file' => 'http://www.preparados.gob.mx/uploads/'.url_slug($fileName).".".$file_ext,
                        'ext' => $file_ext
                    );
                }
            }
        }
        $response['uploaded'] = $uploaded;
        $response['errors'] = $errors;
    }

    echo json_encode($response);
?>