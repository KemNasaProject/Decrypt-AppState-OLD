#!/bin/bash
 
myscript(){
   npm start
}
 
until myscript; do
        echo Script npm start has been crashed with exit code $?. Restart echo now!
        sleep 0
done