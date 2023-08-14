@echo off

REM Ruta al ejecutable de Node.js
set NODE_EXE="C:\Program Files\nodejs\node.exe"

REM Ruta al archivo JavaScript para insertar los datos
set JS_SCRIPT="C:\repositorio\hooks\take_commit.js"

REM Ruta del back
set JS_BACK="C:\repositorio\hooks\ventana\backend.js"

REM Ejecutar el script JavaScript para insertar los datos en la base de datos
%NODE_EXE% %JS_SCRIPT% %1 %2



REM Ruta al archivo main.js de Electron
set ELECTRON_APP="C:\repositorio\hooks\ventana\main.js"

REM Cambiar al directorio de tu proyecto de Electron
cd "C:\repositorio\hooks\ventana"


REM Ejecutar el comando npm run start
npm start


REM Verificar el código de salida del script
IF NOT %ERRORLEVEL% == 0 (
    echo.
    echo El commit ha sido rechazado debido a un error en el script pre-commit.
    echo Por favor, revise el mensaje de error e intente nuevamente.
    echo.
    exit 1
)

exit 0
