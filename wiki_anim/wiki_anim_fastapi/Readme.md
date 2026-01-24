# How initialize the project
## start python enviroment
python3 -m venv fastapi-env

## Install requirements
pip install -r requirements.txt

## init enviroment
- linux
    source ./fastapi-env/Scripts/activate

- windows (powershell)
    .\fastapi-env\Scripts\activate.ps1

## run project
uvicorn src.main:app --reload

## Access docs
http://127.0.0.1:8000/docs