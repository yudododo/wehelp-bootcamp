from fastapi import FastAPI, Request, Form, Response
from fastapi.responses import HTMLResponse, RedirectResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from typing import Annotated
from starlette.middleware.sessions import SessionMiddleware
import mysql.connector
import os  
from dotenv import load_dotenv

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
app.add_middleware(SessionMiddleware, secret_key="your_secret_key", session_cookie = "test_session")
templates = Jinja2Templates(directory="templates")

# 載入 .env 變數
load_dotenv()
mydb = mysql.connector.connect(
  host=os.getenv("DB_HOST"),
  user=os.getenv("DB_USER"),
  password=os.getenv("DB_PASSWORD"),
  database=os.getenv("DB_NAME")
)
# mycursor = mydb.cursor()
mycursor = mydb.cursor(dictionary=True)


@app.get("/", response_class=HTMLResponse)
def home_page(request: Request):
  return templates.TemplateResponse("index.html", {"request": request})
  # return templates.TemplateResponse(request=request, name="index.html")

@app.post("/signup", response_class=HTMLResponse)
def signup(
  name: Annotated[str, Form()],
  username: Annotated[str, Form()],
  password: Annotated[str, Form()],
):
  # 檢查是否已經存在這個帳號
  mycursor.execute(
    "SELECT * FROM member WHERE username = %s",
    (username,)
  )
  existing_user = mycursor.fetchone()
  if existing_user:
    return RedirectResponse(
      url="/error?message=Repeated+username",
      status_code=303
    )
  mycursor.execute(
    "INSERT INTO member (name, username, password) VALUES (%s, %s, %s)", 
    (name, username, password)
  )
  mydb.commit()
  return RedirectResponse(url="/", status_code=303)
    
@app.post("/signin", response_class=HTMLResponse)
def signin(
  username: Annotated[str, Form()],
  password: Annotated[str, Form()],
  request: Request = None,
):
  mycursor.execute(
    "SELECT * FROM member WHERE username = %s AND password = %s",
    (username, password)
  )
  user = mycursor.fetchone()
  if not user:  
    return RedirectResponse(url="/error?message=帳號或密碼輸入錯誤", status_code=303)
  
  request.session["SIGNED-IN"] = True  
  request.session["USER_ID"] = user["id"]
  request.session["USERNAME"] = user["username"]
  request.session["NAME"] = user["name"]
  return RedirectResponse(url="/member", status_code=303)

@app.get("/member", response_class=HTMLResponse)
def member_page(request: Request):
  if not request.session.get("SIGNED-IN"): 
    return RedirectResponse(url="/", status_code=303)
  name = request.session.get("NAME")
  # user_id = request.session.get("USER_ID")
  
  sql = """
    SELECT message.id, member.name AS sender_name, message.content, message.time
    FROM message
    JOIN member ON message.member_id = member.id
    ORDER BY message.time DESC;
    """
  mycursor.execute(sql)
  messages = mycursor.fetchall()
  return templates.TemplateResponse("member.html", {"request": request, "name": name, "messages": messages})

@app.get("/error", response_class=HTMLResponse)
def error_page(request: Request, message: str):
  return templates.TemplateResponse("error.html", {"request": request, "message": message})

@app.get("/signout", response_class=HTMLResponse)
def signout(request: Request):
  request.session.clear()
  return RedirectResponse(url="/", status_code=303)

@app.post("/createMessage", response_class=HTMLResponse)
def create_message(request: Request, message_content: str = Form(...)):
  user_id = request.session.get("USER_ID")
  if not user_id:
    return RedirectResponse(url="/error?message=You+are+not+logged+in", status_code=303)
  mycursor.execute(
    "INSERT INTO message (member_id, content) VALUES (%s, %s)", 
    (user_id, message_content))
  mydb.commit()
  return RedirectResponse(url="/member", status_code=303)

@app.get("/api/member", response_class=JSONResponse)
def query_member(request: Request, username: str ):
  if not request.session.get("SIGNED-IN"): 
    return JSONResponse(content={"data": None}, status_code=200)
  mycursor.execute(
    "SELECT id, name, username FROM member WHERE username = %s",
    (username,)
  )
  member = mycursor.fetchone()
  if member:
    return JSONResponse(content={"data": member}, status_code=200)
  else:
    return JSONResponse(content={"data": None}, status_code=200)
  # 當 API 回傳 status_code = 404 時，fetch 會將其視為錯誤，不會進入 .then()，而是直接進入 .catch (error)

@app.patch("/api/member", response_class=JSONResponse)
async def update_name(request: Request):
  if not request.session.get("SIGNED-IN"): 
    return JSONResponse(content={"error": True}, status_code=200)
  data = await request.json()  # 直接解析 JSON
  new_name = data.get("name")
  user_id = request.session.get("USER_ID")
  mycursor.execute(
    "UPDATE member SET name = %s WHERE id = %s",
    (new_name, user_id)
  )
  mydb.commit()
  request.session["NAME"] = new_name
  return JSONResponse(content={"ok": True}, status_code=200)


# 可以直接跑 python 把 app.py 傳入 uvicorn 來執行
if __name__ == "__main__":
  import uvicorn
  uvicorn.run("app:app", reload=True)