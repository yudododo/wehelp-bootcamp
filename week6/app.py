from fastapi import FastAPI, Request, Form, Response
from fastapi.responses import HTMLResponse, RedirectResponse
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
  return templates.TemplateResponse(request=request, name="index.html")

@app.post("/signup", response_class=HTMLResponse)
def signup(
  name: Annotated[str, Form()],
  username: Annotated[str, Form()],
  password: Annotated[str, Form()],
  request: Request = None,
):
  # 檢查是否已經存在這個帳號
  mycursor.execute("SELECT * FROM member WHERE username = %s", (username,))
  existing_user = mycursor.fetchone()

  if existing_user:
    return RedirectResponse(
      url="/error?message=Repeated+username",
      status_code=303
    )
  else:
    mycursor.execute(
      "INSERT INTO member (name, username, password) VALUES (%s, %s, %s)", 
      (name, username, password)
    )
    mydb.commit()  # 提交更改
    request.session["SIGNED-IN"] = True  # 設置 session
    return RedirectResponse(url="/", status_code=303)
    
@app.post("/signin", response_class=HTMLResponse)
def signin(
  username: Annotated[str, Form()],
  password: Annotated[str, Form()],
  request: Request = None,
):
    
  sql = "SELECT * FROM member WHERE username = %s AND password = %s"
  mycursor.execute(sql, (username, password))
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
    SELECT message.id, member.name AS sender_name, message.content, message.like_count, message.time
    FROM message
    JOIN member ON message.member_id = member.id
    ORDER BY message.time DESC;
    """
  mycursor.execute(sql)
  messages = mycursor.fetchall()
  return templates.TemplateResponse("member.html", {"request": request, "name": name, "messages": messages})

@app.get("/error", response_class=HTMLResponse)
def error_page(request: Request, message: str):
  return templates.TemplateResponse(request=request, name="error.html", context={"message": message})

@app.get("/signout", response_class=HTMLResponse)
def signout(request: Request):
  request.session.clear()
  return RedirectResponse(url="/", status_code=303)

@app.post("/createMessage", response_class=HTMLResponse)
async def create_message(request: Request, message_content: str = Form(...)):
  user_id = request.session.get("USER_ID")
  if not user_id:
    return RedirectResponse(url="/error?message=You+are+not+logged+in", status_code=303)
  sql = "INSERT INTO message (member_id, content) VALUES (%s, %s)"
  mycursor.execute(sql, (user_id, message_content))
  mydb.commit()
  return RedirectResponse(url="/member", status_code=303)

# 可以直接跑 python 把 app.py 傳入 uvicorn 來執行
if __name__ == "__main__":
  import uvicorn
  uvicorn.run("app:app", reload=True)