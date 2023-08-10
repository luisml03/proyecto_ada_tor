@echo off

REM Ruta al repositorio SVN

REM Ruta al ejecutable de Node.js
set NODE_EXE="C:\Program Files\nodejs\node.exe"


set SVNLOOK= "C:\Program Files\TortoiseSVN\bin\svnlook.exe"
REM Ruta al archivo JavaScript para insertar los datos
set JS_SCRIPT="C:\repositorio\hooks\take_commit.js"

REM Ejecutar el script JavaScript para insertar los datos en la base de datos
%NODE_EXE% %JS_SCRIPT% %1 %2


REM Verificar el código de salida del script
IF NOT %ERRORLEVEL% == 0 (
    echo.
    echo El commit ha sido rechazado debido a un error en el script pre-commit.
    echo Por favor, revise el mensaje de error e intente nuevamente.
    echo.
    exit 1
)

exit 0
