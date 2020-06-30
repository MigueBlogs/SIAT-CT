<?php
    require_once("db_fns.php");

    if(isset($_GET["eventos"])) {
        $startDate = isset($_GET["startDate"]) ? $_GET["startDate"] : "";
        $endDate = isset($_GET["endDate"]) ? $_GET["endDate"] : "";

        if(isset($_GET["active"])) getEvents($startDate, $endDate, true);
        else getEvents($startDate, $endDate);
    } else if(isset($_POST["idBoletin"]) && isset($_POST["propiedades"])) {
        $idBoletin = $_POST["idBoletin"];
        $propiedades = json_decode($_POST["propiedades"]);

        insertBoletin($idBoletin, $propiedades);
    } else if(isset($_GET["getRegiones"])) {
        getRegions();
    } else if(isset($_GET["getAutoresDefault"])) {
        getAutoresDefault();
    } else if(isset($_GET["getSeguimiento"])) {
        $idBoletin = $_GET["idBoletin"];
        getSeguimiento($idBoletin);
    } else {
        echo json_encode("Sin datos");
    }

    function getRegions() {
        require_once("db_global.php");

        $conn = dbConnect(user, pass, server);

        $paramsArray = Array();

        $queryStr = "SELECT E.ID_ESTADO, E.NOMBRE, M.ID_REGION FROM MUNICIPIO M, ESTADO E ".
            "WHERE E.ID_ESTADO = M.ID_ESTADO ".
            "GROUP BY E.ID_ESTADO, E.NOMBRE, ID_REGION ".
            "ORDER BY E.ID_ESTADO, ID_REGION";

        $query = oci_parse($conn, $queryStr);

        foreach ($paramsArray as $key => $value) {
            oci_bind_by_name($query, $key, $paramsArray[$key]);
        }

        oci_execute($query);
        $ar = Array();

        while ( ($row = oci_fetch_assoc($query)) != false ) {
            if(!isset($ar[$row['ID_ESTADO']])) 
                $ar[$row['ID_ESTADO']] = [
                    "nombre" =>$row['NOMBRE'],
                    "id" => $row['ID_ESTADO'],
                    "num_reg" => 0,
                    "regiones" => Array()
                ];

            $ar[$row["ID_ESTADO"]]["num_reg"]++;
            $ar[$row["ID_ESTADO"]]["regiones"][] = $row["ID_REGION"];
        }
        
        dbClose($conn, $query);
        echo json_encode($ar);
    }

    function getAutoresDefault() {
        require_once("db_global.php");

        $conn = dbConnect(user, pass, server);

        $paramsArray = Array();

        $queryStr = "SELECT ID_AUTOR, ESTUDIOS, NOMBRE, AP_PATERNO, AP_MATERNO FROM AUTOR ".
            "WHERE AUTORDEFAULT = '1' ".
            "ORDER BY ID_AUTOR";

        $query = oci_parse($conn, $queryStr);

        foreach ($paramsArray as $key => $value) {
            oci_bind_by_name($query, $key, $paramsArray[$key]);
        }

        oci_execute($query);
        $ar = Array();

        while ( ($row = oci_fetch_assoc($query)) != false ) {
            $result = [
                "idAutor" => $row["ID_AUTOR"],
                "nombre" => $row["ESTUDIOS"]." ".$row["NOMBRE"]." ".$row["AP_PATERNO"]." ".$row["AP_MATERNO"]
            ];

            $ar[] = $result;
        }
        
        dbClose($conn, $query);
        echo json_encode($ar);
    }

    function getEvents($startDate, $endDate, $active = false) {
        require_once("db_global.php");

        $conn = dbConnect(user, pass, server);

        $paramsArray = Array();

        $queryStr = "SELECT ID_BOLETIN, NOMBRE_EVENTO, TO_CHAR(FECHA, 'YYYY/MM/DD') FECHA, C.NOMBRE CATEGORIA ".
        "FROM BOLETIN B, CATEGORIA_EVENTO C ".
        "WHERE B.ID_CATEGORIA_EVENTO = C.ID_CATEGORIA_EVENTO ".
        "AND BOL_ID_BOLETIN IS NULL ";
        
        if($active) $queryStr .= "AND FINAL = '0' ";

        if( $startDate ) {
            $queryStr .= "AND FECHA BETWEEN TO_DATE(:startDate, 'DD/MM/YYYY') AND ";
            $queryParams[":startDate"] = $startDate;
        } else
            $queryStr .= "AND FECHA BETWEEN TO_DATE('01/01/2013', 'DD/MM/YYYY') AND ";         
        
        if( $endDate ) {
            $queryStr .= "TO_DATE(:endDate, 'DD/MM/YYYY) ";
            $paramsArray[":endDate"] = $endDate;
        } else 
            $queryStr .= "(SELECT SYSDATE FROM DUAL) ";

        $queryStr .= "ORDER BY FECHA DESC";

        $query = oci_parse($conn, $queryStr);

        foreach ($paramsArray as $key => $value) {
            oci_bind_by_name($query, $key, $paramsArray[$key]);
        }

        oci_execute($query);
        $ar = Array();

        while ( ($row = oci_fetch_assoc($query)) != false ) {
            $idBoletin = $row['ID_BOLETIN'];
            $nombre = $row['NOMBRE_EVENTO'];
            $fecha = $row['FECHA'];
            $categoria = $row['CATEGORIA'];

            $result = [
                'idBoletin' => $idBoletin,
                'nombre' => $nombre,
                'fecha' => $fecha,
                'categoria' => $categoria
            ];

            $ar[] = $result;
        }
        
        dbClose($conn, $query);
        echo json_encode($ar);
    }

    function getSeguimiento($idBoletin) {
        require_once("db_global.php");

        $conn = dbConnect(user, pass, server);

        $paramsArray = Array(
            ":idBoletin" => $idBoletin
        );

        $queryStr = "SELECT ID_BOLETIN, NOMBRE_EVENTO, TO_CHAR(FECHA, 'DDMMYYYY') FECHA FROM BOLETIN ".
            "START WITH ID_BOLETIN = :idBoletin ".
            "CONNECT BY PRIOR ID_BOLETIN = BOL_ID_BOLETIN ";

        $query = oci_parse($conn, $queryStr);

        foreach ($paramsArray as $key => $value) {
            oci_bind_by_name($query, $key, $paramsArray[$key]);
        }

        oci_execute($query);
        $ar = Array();

        while ( ($row = oci_fetch_assoc($query)) != false ) {
            $idBoletin = $row['ID_BOLETIN'];
            $nombre = $row['NOMBRE_EVENTO'];
            $fecha = $row['FECHA'];

            $result = [
                'idBoletin' => $idBoletin,
                'nombre' => $nombre,
                'fecha' => $fecha
            ];

            $ar[] = $result;
        }
        
        dbClose($conn, $query);
        echo json_encode($ar);
    }

    function getEventInfo($idBoletin) {
        require_once("db_global.php");

        $conn = dbConnect(user, pass, server);

        $paramsArray = Array(
            ":idBoletin" => $idBoletin
        );

        $query = oci_parse($conn, $queryStr);

        $queryStr = "SELECT A.ID_TIPO_ALERTA, A.ID_NIVEL_ALERTA, A.ID_ESTADO, A.ID_REGION ".
            "FROM ALERTAMIENTO A ".
            "WHERE A.ID_BOLETIN = :idBoletin ".
            "ORDER BY A.ID_ESTADO, A.ID_REGION";

        foreach ($paramsArray as $key => $value) {
            oci_bind_by_name($query, $key, $paramsArray[$key]);
        }

        oci_execute($query);
        $ar = Array();

        while ( ($row = oci_fetch_assoc($query)) != false ) {
            $tipoAlerta = $row['ID_TIPO_ALERTA'];
            $nivelAlerta = $row['ID_NIVEL_ALERTA'];
            $idEstado = $row['ID_ESTADO'];
            $region = $row['ID_REGION'];

            $result = [
                
            ];

            $ar[] = $result;
        }
        
        dbClose($conn, $query);
        echo json_encode($ar);
    }

    function insertBoletin($idBoletin, $propiedades) {
        require_once("db_global.php");

        $conn = dbConnect(user, pass, server);

        if(!$propiedades->comentarios) $propiedades->comentarios = 'Para más información consulte el aviso más reciente del Servicio Meteorológico Nacional.';

        $paramsArray = Array(
            ":idBoletin" => $idBoletin,
            ":idCategoriaEvento" => (int)$propiedades->idCategoriaEvento,
            ":nombreEvento" => $propiedades->nombreEvento,
            ":fecha" => $propiedades->fechaParse,
            ":oceano" => $propiedades->oceano,
            ":latitud" => $propiedades->latitud,
            ":longitud" => $propiedades->longitud,
            ":comentarios" => $propiedades->comentarios,
            ":infoGeneral" => $propiedades->infoGeneral,
            ":zonasVigilancia" => $propiedades->zonasVigilancia,
            ":final" => $propiedades->final
        );

        $queryStr = "INSERT INTO BOLETIN(ID_BOLETIN, ID_CATEGORIA_EVENTO, NOMBRE_EVENTO, FECHA, OCEANO, LATITUD, LONGITUD, COMENTARIOS, INFO_GENERAL, ZONAS_VIGILANCIA, FINAL ";

        if(isset($propiedades->idSeguimiento)) {
            $paramsArray[":idSeguimiento"] = $propiedades->idSeguimiento;
            $queryStr .= ", BOL_ID_BOLETIN ";
        }

        $queryStr .= ") VALUES (:idBoletin, :idCategoriaEvento, :nombreEvento, TO_DATE(:fecha, 'YYYY/MM/DD'), :oceano, :latitud, :longitud, :comentarios, :infoGeneral, :zonasVigilancia, :final ";
        
        if(isset($propiedades->idSeguimiento)) $queryStr .= ", :idSeguimiento ";

        $queryStr .= ")";

        $query = oci_parse($conn, $queryStr);

        foreach ($paramsArray as $key => $value) {
            oci_bind_by_name($query, $key, $paramsArray[$key]);
        }

        $result = Array();

        if(oci_execute($query, OCI_NO_AUTO_COMMIT)) {
            $queriesEfectos = Array();

            if(isset($propiedades->efectos)) {
                foreach($propiedades->efectos as $efecto) {
                    $queryStr = "INSERT INTO BOLETIN_EFECTO(ID_BOLETIN, ID_EFECTO, DETALLE) VALUES (:idBoletin, :idEfecto, :detalle)";
                    $parameters = [
                        ":idBoletin" => $idBoletin,
                        ":idEfecto" => $efecto->idEfecto,
                        ":detalle" => $efecto->detalle
                    ];
    
                    $query = oci_parse($conn, $queryStr);
    
                    foreach ($parameters as $key => $value) {
                        oci_bind_by_name($query, $key, $parameters[$key]);
                    }
    
                    if(!oci_execute($query, OCI_NO_AUTO_COMMIT)) {
                        //$error = oci_error($query);
                        //$result["error"] = [
                        //    "message" => $error['message'],
                        //    "description" => "No se pudo insertar efecto";
                        //];
                        oci_rollback($conn);
                        trigger_error("No se pudo insertar efecto", E_USER_ERROR);
                    } else {
                        oci_free_statement($query);
                    }
                }
            }

            if(isset($propiedades->autores)) {
                foreach($propiedades->autores as $idAutor) {
                    $queryStr = "INSERT INTO BOLETIN_AUTOR(ID_BOLETIN, ID_AUTOR) VALUES (:idBoletin, :idAutor)";
                    $parameters = [
                        ":idBoletin" => $idBoletin,
                        ":idAutor" => $idAutor
                    ];
    
                    $query = oci_parse($conn, $queryStr);
    
                    foreach ($parameters as $key => $value) {
                        oci_bind_by_name($query, $key, $parameters[$key]);
                    }
    
                    if(!oci_execute($query, OCI_NO_AUTO_COMMIT)) {
                        // $error = oci_error($query);
                        // $result["error"] = [
                        //     "message" => $error['message'],
                        //     "description" => "No se pudo insertar autor";
                        // ];
                        oci_rollback($conn);
                        trigger_error("No se pudo insertar autor", E_USER_ERROR);
                    } else {
                        oci_free_statement($query);
                    }
                }
            }

            if(isset($propiedades->archivos)) {
                foreach($propiedades->archivos as $archivo) {
                    $queryStr = "INSERT INTO ARCHIVO(ID_BOLETIN, URL, TIPO) VALUES (:idBoletin, :url, :tipo)";
                    $parameters = [
                        ":idBoletin" => $idBoletin,
                        ":url" => $archivo->url,
                        ":tipo" => $archivo->tipo
                    ];
    
                    $query = oci_parse($conn, $queryStr);
    
                    foreach ($parameters as $key => $value) {
                        oci_bind_by_name($query, $key, $parameters[$key]);
                    }
    
                    if(!oci_execute($query, OCI_NO_AUTO_COMMIT)) {
                        // $error = oci_error($query);
                        // $result["error"] = [
                        //     "message" => $error['message'],
                        //     "description" => "No se pudo insertar archivo";
                        // ];
                        oci_rollback($conn);
                        trigger_error("No se pudo insertar archivo", E_USER_ERROR);
                    } else {
                        oci_free_statement($query);
                    }
                }       
            }

            if(isset($propiedades->regiones)) {
                foreach($propiedades->regiones as $estado) {
                    foreach($estado as $region) {
                        $queryStr = "INSERT INTO ALERTAMIENTO(ID_BOLETIN, ID_NIVEL_ALERTA, ID_TIPO_ALERTA, ID_ESTADO, ID_REGION) VALUES (:idBoletin, :idNivelAlerta, :idTipoAlerta, :idEstado, :idRegion)";
                        $parameters = [
                            ":idBoletin" => $idBoletin,
                            ":idNivelAlerta" => $region->nivel_alerta,
                            ":idTipoAlerta" => $region->tipo,
                            ":idEstado" => (int)$region->estado,
                            ":idRegion" => $region->region
                        ];
        
                        $query = oci_parse($conn, $queryStr);
        
                        foreach ($parameters as $key => $value) {
                            oci_bind_by_name($query, $key, $parameters[$key]);
                        }
        
                        if(!oci_execute($query, OCI_NO_AUTO_COMMIT)) {
                            // $error = oci_error($query);
                            // $result["error"] = [
                            //     "message" => $error['message'],
                            //     "description" => "No se pudo insertar archivo";
                            // ];
                            oci_rollback($conn);
                            trigger_error("No se pudo insertar region", E_USER_ERROR);
                        } else {
                            oci_free_statement($query);
                        }
                    }
                }
            }
        } else {
            // $error = oci_error($query);
            // $result["error"] = [
            //     "message" => $error['message'],
            //     "description" => "No se pudo crear el boletin";
            // ];
            oci_rollback($conn);
            trigger_error("No se pudo crear el boletin", E_USER_ERROR);
        }
        
        $result["error"] = Array();
        $result["result"] = [
            "message" => "Boletín creado",
            "description" => ""
        ];

        oci_commit($conn);
        oci_close($conn);
        echo json_encode($result);    
    }

    function getActiveEvents() {

    }

    set_error_handler('errorManager');

    function errorManager($errno, $errstr, $errfile, $errline, $errcontext) {
        if(!(error_reporting() & $errno)) { return; }

        switch($errno) {
            case E_USER_ERROR:
                $error = oci_error($errcontext['query']);
                $result["error"] = [
                    "message" => $error['message'],
                    "description" => "No se pudo crear el boletin"
                ];
            break;
        }
    }
?>