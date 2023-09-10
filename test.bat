@echo off
goto start
:start
    node index.js
    C:\Users\mindr\Downloads\image.png
    goto input
:input
    cls
    set "response="
    set /p response=Do you want to redo? (y/n)
    set firstresponse=%response:~0,5%
    if %firstresponse%==y goto start
    if %firstresponse%==n goto end
:end
    exit
