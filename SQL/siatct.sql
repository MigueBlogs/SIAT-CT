/*==============================================================*/
/* DBMS name:      ORACLE Version 11g                           */
/* Created on:     22/08/2019 02:30:28 p.m.                     */
/*==============================================================*/


alter table ALERTAMIENTO
   drop constraint FK_ALERTAMI_RELATIONS_TIPO_ALE;

alter table ALERTAMIENTO
   drop constraint FK_ALERTAMI_RELATIONS_NIVEL_AL;

alter table ALERTAMIENTO
   drop constraint FK_ALERTAMI_RELATIONS_BOLETIN;

alter table ALERTAMIENTO
   drop constraint FK_ALERTAMI_RELATIONS_ESTADO;

alter table ALERTAMIENTO
   drop constraint FK_ALERTAMI_RELATIONS_REGION;

alter table ARCHIVO
   drop constraint FK_ARCHIVO_RELATIONS_BOLETIN;

alter table BOLETIN
   drop constraint FK_BOLETIN_RELATIONS_BOLETIN;

alter table BOLETIN
   drop constraint FK_BOLETIN_RELATIONS_CATEGORI;

alter table BOLETIN_AUTOR
   drop constraint FK_BOLETIN_EFECTO_EFECTO;

alter table BOLETIN_AUTOR
   drop constraint FK_BOLETIN__RELATIONS_AUTOR;

alter table BOLETIN_EFECTO
   drop constraint FK_BOLETIN_BOLETIN_EFECTO;

alter table BOLETIN_EFECTO
   drop constraint FK_BOLETIN__RELATIONS_EFECTO;

alter table BOLETIN_RECOMENDACION
   drop constraint FK_BOLETIN__RELATIONS_RECOMEND;

alter table BOLETIN_RECOMENDACION
   drop constraint FK_BOLETIN__RELATIONS_BOLETIN;

alter table MUNICIPIO
   drop constraint FK_MUNICIPI_RELATIONS_ESTADO;

alter table MUNICIPIO
   drop constraint FK_MUNICIPI_RELATIONS_REGION;

alter table RECOMENDACION
   drop constraint FK_RECOMEND_RELATIONS_NIVEL_AL;

alter table RECOMENDACION
   drop constraint FK_RECOMEND_RELATIONS_TIPO_ALE;

alter table RECOMENDACION
   drop constraint FK_RECOMEND_RELATIONS_TIPO_REC;

alter table RECOMENDACION_MATERIAL
   drop constraint FK_RECOMEND_RELATIONS_RECOMEND;

alter table RECOMENDACION_MATERIAL
   drop constraint FK_RECOMEND_RELATIONS_MATERIAL;

drop table ALERTAMIENTO cascade constraints;

drop table ARCHIVO cascade constraints;

drop table AUTOR cascade constraints;

drop table BOLETIN cascade constraints;

drop table BOLETIN_AUTOR cascade constraints;

drop table BOLETIN_EFECTO cascade constraints;

drop table BOLETIN_RECOMENDACION cascade constraints;

drop table CATEGORIA_EVENTO cascade constraints;

drop table EFECTO cascade constraints;

drop table ESTADO cascade constraints;

drop table MATERIAL_APOYO cascade constraints;

drop table MUNICIPIO cascade constraints;

drop table NIVEL_ALERTA cascade constraints;

drop table RECOMENDACION cascade constraints;

drop table RECOMENDACION_MATERIAL cascade constraints;

drop table REGION cascade constraints;

drop table TIPO_ALERTA cascade constraints;

drop table TIPO_RECOMENDACION cascade constraints;

/*==============================================================*/
/* Table: ALERTAMIENTO                                          */
/*==============================================================*/
create table ALERTAMIENTO 
(
   ID_TIPO_ALERTA       NUMBER(1)            not null,
   ID_NIVEL_ALERTA      NUMBER(1)            not null,
   ID_BOLETIN           CHAR(12)             not null,
   ID_ESTADO            NUMBER(2)            not null,
   ID_REGION            CHAR(2)              not null,
   constraint PK_ALERTAMIENTO primary key (ID_TIPO_ALERTA, ID_NIVEL_ALERTA, ID_BOLETIN, ID_ESTADO, ID_REGION)
);

/*==============================================================*/
/* Table: ARCHIVO                                               */
/*==============================================================*/
create table ARCHIVO 
(
   ID_ARCHIVO           NUMBER(10)           not null,
   ID_BOLETIN           CHAR(12)             not null,
   URL                  CLOB                 not null,
   TIPO                 CHAR(4)              not null,
   constraint PK_ARCHIVO primary key (ID_ARCHIVO)
);

/*==============================================================*/
/* Table: AUTOR                                                 */
/*==============================================================*/
create table AUTOR 
(
   ID_AUTOR             NUMBER(4)            not null,
   NOMBRE               VARCHAR2(1024)       not null,
   AP_PATERNO           VARCHAR2(1024)       not null,
   AP_MATERNO           VARCHAR2(1024)       not null,
   CORREO               VARCHAR2(500)        not null,
   CARGO                VARCHAR2(1024)       not null,
   FECHA_ENTRADA        DATE                 not null,
   FECHA_SALIDA         DATE                 not null,
   ACTIVO               CHAR(1)              not null,
   constraint PK_AUTOR primary key (ID_AUTOR)
);

/*==============================================================*/
/* Table: BOLETIN                                               */
/*==============================================================*/
create table BOLETIN 
(
   ID_BOLETIN           CHAR(12)             not null,
   ID_CATEGORIA_EVENTO  NUMBER(1)            not null,
   BOL_ID_BOLETIN       CHAR(12),
   NOMBRE_EVENTO        VARCHAR2(200)        not null,
   FECHA                DATE                 not null,
   OCEANO               CHAR(1)              not null,
   LATITUD              CHAR(13)             not null,
   LONGITUD             CHAR(13)             not null,
   COMENTARIOS          CLOB                 not null,
   INFO_GENERAL         CLOB                 not null,
   ZONAS_VIGILANCIA     VARCHAR2(2048)       not null,
   FINAL                CHAR(1)              not null,
   constraint PK_BOLETIN primary key (ID_BOLETIN)
);

/*==============================================================*/
/* Table: BOLETIN_AUTOR                                         */
/*==============================================================*/
create table BOLETIN_AUTOR 
(
   ID_BOLETIN           CHAR(12)             not null,
   ID_AUTOR             NUMBER(4)            not null,
   constraint PK_BOLETIN_AUTOR primary key (ID_BOLETIN, ID_AUTOR)
);

/*==============================================================*/
/* Table: BOLETIN_EFECTO                                        */
/*==============================================================*/
create table BOLETIN_EFECTO 
(
   ID_EFECTO            NUMBER(4)            not null,
   ID_BOLETIN           CHAR(12)             not null,
   DETALLE              CLOB                 not null,
   constraint PK_BOLETIN_EFECTO primary key (ID_EFECTO, ID_BOLETIN)
);

/*==============================================================*/
/* Table: BOLETIN_RECOMENDACION                                 */
/*==============================================================*/
create table BOLETIN_RECOMENDACION 
(
   ID_RECOMENDACION     NUMBER(4)            not null,
   ID_BOLETIN           CHAR(12)             not null,
   constraint PK_BOLETIN_RECOMENDACION primary key (ID_RECOMENDACION, ID_BOLETIN)
);

/*==============================================================*/
/* Table: CATEGORIA_EVENTO                                      */
/*==============================================================*/
create table CATEGORIA_EVENTO 
(
   ID_CATEGORIA_EVENTO  NUMBER(1)            not null,
   NOMBRE               VARCHAR2(200)        not null,
   VALOR                NUMBER(1)            not null,
   ABREVIATURA          CHAR(2)              not null,
   constraint PK_CATEGORIA_EVENTO primary key (ID_CATEGORIA_EVENTO)
);

/*==============================================================*/
/* Table: EFECTO                                                */
/*==============================================================*/
create table EFECTO 
(
   ID_EFECTO            NUMBER(4)            not null,
   NOMBRE               VARCHAR2(1024)       not null,
   constraint PK_EFECTO primary key (ID_EFECTO)
);

/*==============================================================*/
/* Table: ESTADO                                                */
/*==============================================================*/
create table ESTADO 
(
   ID_ESTADO            NUMBER(2)            not null,
   NOMBRE               VARCHAR2(500)        not null,
   constraint PK_ESTADO primary key (ID_ESTADO)
);

/*==============================================================*/
/* Table: MATERIAL_APOYO                                        */
/*==============================================================*/
create table MATERIAL_APOYO 
(
   ID_MATERIAL_APOYO    NUMBER(3)            not null,
   TITULO               VARCHAR2(500)        not null,
   FUENTE               VARCHAR2(500)        not null,
   URL                  CLOB                 not null,
   QR_URL               CLOB                 not null,
   constraint PK_MATERIAL_APOYO primary key (ID_MATERIAL_APOYO)
);

/*==============================================================*/
/* Table: MUNICIPIO                                             */
/*==============================================================*/
create table MUNICIPIO 
(
   ID_MUNICIPIO         CHAR(5)              not null,
   ID_ESTADO            NUMBER(2)            not null,
   ID_REGION            CHAR(2)              not null,
   NOMBRE               VARCHAR2(1024)       not null,
   constraint PK_MUNICIPIO primary key (ID_MUNICIPIO)
);

/*==============================================================*/
/* Table: NIVEL_ALERTA                                          */
/*==============================================================*/
create table NIVEL_ALERTA 
(
   ID_NIVEL_ALERTA      NUMBER(1)            not null,
   NOMBRE               VARCHAR2(200)        not null,
   COLORHEX             CHAR(6)              not null,
   PERIODO_ACTUALIZACION NUMBER(2)            not null,
   constraint PK_NIVEL_ALERTA primary key (ID_NIVEL_ALERTA)
);

/*==============================================================*/
/* Table: RECOMENDACION                                         */
/*==============================================================*/
create table RECOMENDACION 
(
   ID_RECOMENDACION     NUMBER(4)            not null,
   ID_NIVEL_ALERTA      NUMBER(1)            not null,
   ID_TIPO_ALERTA       NUMBER(1),
   ID_TIPO_RECOMENDACION NUMBER(2)            not null,
   TEXTO                CLOB                 not null,
   constraint PK_RECOMENDACION primary key (ID_RECOMENDACION)
);

/*==============================================================*/
/* Table: RECOMENDACION_MATERIAL                                */
/*==============================================================*/
create table RECOMENDACION_MATERIAL 
(
   ID_RECOMENDACION     NUMBER(4)            not null,
   ID_MATERIAL_APOYO    NUMBER(3)            not null,
   constraint PK_RECOMENDACION_MATERIAL primary key (ID_RECOMENDACION, ID_MATERIAL_APOYO)
);

/*==============================================================*/
/* Table: REGION                                                */
/*==============================================================*/
create table REGION 
(
   ID_REGION            CHAR(2)              not null,
   NOMBRE               VARCHAR2(500)        not null,
   constraint PK_REGION primary key (ID_REGION)
);

/*==============================================================*/
/* Table: TIPO_ALERTA                                           */
/*==============================================================*/
create table TIPO_ALERTA 
(
   ID_TIPO_ALERTA       NUMBER(1)            not null,
   NOMBRE               VARCHAR2(200)        not null,
   constraint PK_TIPO_ALERTA primary key (ID_TIPO_ALERTA)
);

/*==============================================================*/
/* Table: TIPO_RECOMENDACION                                    */
/*==============================================================*/
create table TIPO_RECOMENDACION 
(
   ID_TIPO_RECOMENDACION NUMBER(2)            not null,
   TIPO                 VARCHAR2(500)        not null,
   constraint PK_TIPO_RECOMENDACION primary key (ID_TIPO_RECOMENDACION)
);

alter table ALERTAMIENTO
   add constraint FK_ALERTAMI_RELATIONS_TIPO_ALE foreign key (ID_TIPO_ALERTA)
      references TIPO_ALERTA (ID_TIPO_ALERTA);

alter table ALERTAMIENTO
   add constraint FK_ALERTAMI_RELATIONS_NIVEL_AL foreign key (ID_NIVEL_ALERTA)
      references NIVEL_ALERTA (ID_NIVEL_ALERTA);

alter table ALERTAMIENTO
   add constraint FK_ALERTAMI_RELATIONS_BOLETIN foreign key (ID_BOLETIN)
      references BOLETIN (ID_BOLETIN);

alter table ALERTAMIENTO
   add constraint FK_ALERTAMI_RELATIONS_ESTADO foreign key (ID_ESTADO)
      references ESTADO (ID_ESTADO);

alter table ALERTAMIENTO
   add constraint FK_ALERTAMI_RELATIONS_REGION foreign key (ID_REGION)
      references REGION (ID_REGION);

alter table ARCHIVO
   add constraint FK_ARCHIVO_RELATIONS_BOLETIN foreign key (ID_BOLETIN)
      references BOLETIN (ID_BOLETIN);

alter table BOLETIN
   add constraint FK_BOLETIN_RELATIONS_BOLETIN foreign key (BOL_ID_BOLETIN)
      references BOLETIN (ID_BOLETIN);

alter table BOLETIN
   add constraint FK_BOLETIN_RELATIONS_CATEGORI foreign key (ID_CATEGORIA_EVENTO)
      references CATEGORIA_EVENTO (ID_CATEGORIA_EVENTO);

alter table BOLETIN_AUTOR
   add constraint FK_BOLETIN_EFECTO_EFECTO foreign key (ID_BOLETIN)
      references BOLETIN (ID_BOLETIN);

alter table BOLETIN_AUTOR
   add constraint FK_BOLETIN__RELATIONS_AUTOR foreign key (ID_AUTOR)
      references AUTOR (ID_AUTOR);

alter table BOLETIN_EFECTO
   add constraint FK_BOLETIN_BOLETIN_EFECTO foreign key (ID_BOLETIN)
      references BOLETIN (ID_BOLETIN);

alter table BOLETIN_EFECTO
   add constraint FK_BOLETIN__RELATIONS_EFECTO foreign key (ID_EFECTO)
      references EFECTO (ID_EFECTO);

alter table BOLETIN_RECOMENDACION
   add constraint FK_BOLETIN__RELATIONS_RECOMEND foreign key (ID_RECOMENDACION)
      references RECOMENDACION (ID_RECOMENDACION);

alter table BOLETIN_RECOMENDACION
   add constraint FK_BOLETIN__RELATIONS_BOLETIN foreign key (ID_BOLETIN)
      references BOLETIN (ID_BOLETIN);

alter table MUNICIPIO
   add constraint FK_MUNICIPI_RELATIONS_ESTADO foreign key (ID_ESTADO)
      references ESTADO (ID_ESTADO);

alter table MUNICIPIO
   add constraint FK_MUNICIPI_RELATIONS_REGION foreign key (ID_REGION)
      references REGION (ID_REGION);

alter table RECOMENDACION
   add constraint FK_RECOMEND_RELATIONS_NIVEL_AL foreign key (ID_NIVEL_ALERTA)
      references NIVEL_ALERTA (ID_NIVEL_ALERTA);

alter table RECOMENDACION
   add constraint FK_RECOMEND_RELATIONS_TIPO_ALE foreign key (ID_TIPO_ALERTA)
      references TIPO_ALERTA (ID_TIPO_ALERTA);

alter table RECOMENDACION
   add constraint FK_RECOMEND_RELATIONS_TIPO_REC foreign key (ID_TIPO_RECOMENDACION)
      references TIPO_RECOMENDACION (ID_TIPO_RECOMENDACION);

alter table RECOMENDACION_MATERIAL
   add constraint FK_RECOMEND_RELATIONS_RECOMEND foreign key (ID_RECOMENDACION)
      references RECOMENDACION (ID_RECOMENDACION);

alter table RECOMENDACION_MATERIAL
   add constraint FK_RECOMEND_RELATIONS_MATERIAL foreign key (ID_MATERIAL_APOYO)
      references MATERIAL_APOYO (ID_MATERIAL_APOYO);

