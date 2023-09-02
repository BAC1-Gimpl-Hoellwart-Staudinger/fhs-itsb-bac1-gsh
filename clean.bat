@echo off
setlocal enabledelayedexpansion

REM Get the current directory where the script is executed
set "latex_directory=%cd%"

REM List of file extensions to delete (add more if needed)
set "extensions=.aux .log .synctex.gz .toc .out .bbl .blg .gz .dvi .sh .bcf .lof .lol .lot .run.xml .latexmkrc"

REM Loop through the directory and its subfolders
for /r "%latex_directory%" %%f in (*) do (
    REM Get the file extension
    set "file=%%~xf"
    
    REM Check if the file extension is in the list of extensions to delete
    if "!extensions:%%~xf=!" neq "!extensions!" (
        REM Delete the file
        del "%%f"
        echo Deleted: "%%f"
    )
)

echo Cleanup complete in the current directory: %latex_directory%
pause
