<?php
    require_once("db_fns.php");

    if(isset($_GET["evento"]) && isset($_GET["idBoletin"])) {
        $idBoletin = $_GET["idBoletin"];
        getEvent($idBoletin);
    }

    function getEvent($idBoletin) {
        require_once("db_global.php");

        $conn = dbConnect(user, pass, server);

        $paramsArray = Array(
            ":idBoletin" => $idBoletin
        );
        
        $queryStr = "SELECT C.NOMBRE CATEGORIA, B.NOMBRE_EVENTO NOMBRE, B.INFO_GENERAL INFO_GENERAL, TO_CHAR(B.FECHA, 'YYYY-MM-DD') FECHA, B.OCEANO, B.COMENTARIOS, B.ZONAS_VIGILANCIA ZONAS_VIGILANCIA, T.NOMBRE TIPO_ALERTA, N.NOMBRE NIVEL_ALERTA, E.ID_ESTADO ID_ESTADO, E.NOMBRE ESTADO, A.ID_REGION ID_REGION, R.NOMBRE REGION ".
            "FROM BOLETIN B, CATEGORIA_EVENTO C, ALERTAMIENTO A, TIPO_ALERTA T, NIVEL_ALERTA N, ESTADO E, REGION R ".
            "WHERE B.ID_CATEGORIA_EVENTO = C.ID_CATEGORIA_EVENTO ".
            "AND B.ID_BOLETIN = A.ID_BOLETIN(+) ".
            "AND A.ID_TIPO_ALERTA = T.ID_TIPO_ALERTA(+) ".
            "AND A.ID_NIVEL_ALERTA = N.ID_NIVEL_ALERTA(+) ".
            "AND A.ID_ESTADO = E.ID_ESTADO(+) ".
            "AND A.ID_REGION = R.ID_REGION(+) ".
            "AND B.ID_BOLETIN = :idBoletin ".
            "ORDER BY TIPO_ALERTA, N.ID_NIVEL_ALERTA, ID_ESTADO";

        $query = oci_parse($conn, $queryStr);

        foreach ($paramsArray as $key => $value) {
            oci_bind_by_name($query, $key, $paramsArray[$key]);
        }

        oci_execute($query);
        $ar = Array(
            "nombre" => "",
            "categoria" => "",
            "fecha" => "",
            "oceano" => "",
            "comentarios" => "",
            "zonasVigilancia" => "",
            "generalInfo" => "",
            "efectos" => [],
            "alertas" => [
                "ACERCÁNDOSE" => [
                    "ROJA" => [],
                    "NARANJA" => [],
                    "AMARILLA" => [],
                    "VERDE" => [],
                    "AZUL" => []
                ],
                "ALEJANDOSE" => [
                    "ROJA" => [],
                    "NARANJA" => [],
                    "AMARILLA" => [],
                    "VERDE" => [],
                    "AZUL" => []
                ]
            ]
        );

        while ( ($row = oci_fetch_assoc($query)) != false ) {
            $ar["nombre"] = $row["NOMBRE"];
            $ar["categoria"] = $row["CATEGORIA"];
            $ar["fecha"] = $row["FECHA"];
            $ar["oceano"] = $row["OCEANO"] == "P" ? "PACÍFICO" : "ATLÁNTICO";
            $ar["comentarios"] = $row["COMENTARIOS"]->load();
            $ar["generalInfo"] = $row["INFO_GENERAL"]->load();
            $ar["zonasVigilancia"] = $row["ZONAS_VIGILANCIA"];
            if( isset($row["TIPO_ALERTA"]) && isset($row["NIVEL_ALERTA"]) ) {
                if(!isset($ar["alertas"][$row["TIPO_ALERTA"]][$row["NIVEL_ALERTA"]][mb_convert_case($row["ESTADO"], MB_CASE_TITLE, 'UTF-8')])) {
                    $ar["alertas"][$row["TIPO_ALERTA"]][$row["NIVEL_ALERTA"]][mb_convert_case($row["ESTADO"], MB_CASE_TITLE, 'UTF-8')] = [
                        "idEstado" => $row["ID_ESTADO"],
                        "estado" => mb_convert_case($row["ESTADO"], MB_CASE_TITLE, 'UTF-8'),
                        "municipios" => [],
                        "regiones" => [
                            "ids" => [],
                            "nombres" => []
                        ]
                    ];
                }
                
                $ar["alertas"][$row["TIPO_ALERTA"]][$row["NIVEL_ALERTA"]][mb_convert_case($row["ESTADO"], MB_CASE_TITLE, 'UTF-8')]["regiones"]["ids"][] = $row["ID_REGION"];
                $ar["alertas"][$row["TIPO_ALERTA"]][$row["NIVEL_ALERTA"]][mb_convert_case($row["ESTADO"], MB_CASE_TITLE, 'UTF-8')]["regiones"]["nombres"][] = mb_convert_case($row["REGION"], MB_CASE_TITLE, 'UTF-8');
            }
        }
        
        dbClose($conn, $query);

        $generalInfoArray = explode("|", $ar["generalInfo"]);
        $ar["titulo"] = $generalInfoArray[0];
        $ar["hora"] = $generalInfoArray[1];
        $ar["localizacion"] = $generalInfoArray[3];
        $ar["desplazamiento"] = $generalInfoArray[4];
        $ar["sostenidos"] = $generalInfoArray[5];
        $ar["rachas"] = $generalInfoArray[6];

        getEffects($idBoletin, $ar);
    }

    function getEffects($idBoletin, &$boletin) {
        require_once("db_global.php");

        $conn = dbConnect(user, pass, server);

        $paramsArray = Array(
            ":idBoletin" => $idBoletin
        );

        $queryStr = "SELECT DETALLE FROM BOLETIN_EFECTO ".
            "WHERE ID_BOLETIN = :idBoletin ".
            "ORDER BY ID_BOLETIN, ID_EFECTO";

        $query = oci_parse($conn, $queryStr);

        foreach ($paramsArray as $key => $value) {
            oci_bind_by_name($query, $key, $paramsArray[$key]);
        }

        oci_execute($query);
        $ar = Array();

        while ( ($row = oci_fetch_assoc($query)) != false ) {
            $boletin["efectos"][] = $row["DETALLE"]->load();
        }
        
        dbClose($conn, $query);   
        getUrls($idBoletin, $boletin);
    }

    function getUrls($idBoletin, &$boletin) {
        require_once("db_global.php");

        $conn = dbConnect(user, pass, server);

        $paramsArray = Array(
            ":idBoletin" => $idBoletin
        );

        $queryStr = "SELECT URL ".
            "FROM ARCHIVO ".
            "WHERE ID_BOLETIN = :idBoletin ".
            "AND TIPO IN ('kml', 'kmz', 'KML', 'KMZ') ";

        $query = oci_parse($conn, $queryStr);

        foreach ($paramsArray as $key => $value) {
            oci_bind_by_name($query, $key, $paramsArray[$key]);
        }

        oci_execute($query);
        $ar = Array();

        $boletin["archivos"] = Array();

        while ( ($row = oci_fetch_assoc($query)) != false ) {
            $boletin["archivos"][] = $row["URL"]->load();
        }
        
        dbClose($conn, $query);
        getCounties($idBoletin, $boletin);
    }

    function getCounties($idBoletin, &$boletin) {
        require_once("db_global.php");

        $conn = dbConnect(user, pass, server);

        $paramsArray = Array(
            ":idBoletin" => $idBoletin
        );

        $queryStr = "SELECT T.NOMBRE TIPO_ALERTA, N.NOMBRE NIVEL_ALERTA, E.NOMBRE ESTADO, M.ID_MUNICIPIO CVE_MUNICIPIO, M.NOMBRE MUNICIPIO, M.ID_REGION ID_REGION, R.NOMBRE REGION ".
            "FROM ALERTAMIENTO A ".
            "INNER JOIN ESTADO E ".
            "ON A.ID_ESTADO = E.ID_ESTADO ".
            "INNER JOIN MUNICIPIO M ".
            "ON A.ID_REGION = M.ID_REGION ".
            "AND E.ID_ESTADO = M.ID_ESTADO ".
            "INNER JOIN NIVEL_ALERTA N ".
            "ON A.ID_NIVEL_ALERTA = N.ID_NIVEL_ALERTA ".
            "INNER JOIN TIPO_ALERTA T ".
            "ON A.ID_TIPO_ALERTA = T.ID_TIPO_ALERTA ".
            "INNER JOIN REGION R ".
            "ON M.ID_REGION = R.ID_REGION ".
            "WHERE A.ID_BOLETIN = :idBoletin ".
            "ORDER BY TIPO_ALERTA, NIVEL_ALERTA, E.ID_ESTADO, CVE_MUNICIPIO ";

        $query = oci_parse($conn, $queryStr);

        foreach ($paramsArray as $key => $value) {
            oci_bind_by_name($query, $key, $paramsArray[$key]);
        }

        oci_execute($query);
        $ar = Array();

        while ( ($row = oci_fetch_assoc($query)) != false ) {
            $boletin["alertas"][$row["TIPO_ALERTA"]][$row["NIVEL_ALERTA"]][mb_convert_case($row["ESTADO"], MB_CASE_TITLE, 'UTF-8')]["municipios"][] = [
                "clave" => $row["CVE_MUNICIPIO"],
                "nombre" => $row["MUNICIPIO"],
                "idRegion" => $row["ID_REGION"],
                "region" => $row["REGION"]
            ];
        }
        
        dbClose($conn, $query);
        echo json_encode($boletin);
        // getUrls($idBoletin, $boletin);
    }
?>