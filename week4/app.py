from fastapi import FastAPI, Request, Form, Response
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from typing import Annotated
from starlette.middleware.sessions import SessionMiddleware

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
app.add_middleware(SessionMiddleware, secret_key="your_secret_key", session_cookie = "test_session")
templates = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse)
def home_page(request: Request):
  return templates.TemplateResponse(request=request, name="index.html")

@app.post("/signin", response_class=HTMLResponse)
def signin(
  username: Annotated[str, Form()],
  password: Annotated[str, Form()],
  agreement: Annotated[bool, Form()] = False,
  request: Request = None,
):
  if agreement == True:
    if username =='' or password =='':
      return RedirectResponse(
        url="/error?message=Please+enter+username+and+password", 
        status_code=303
      )
    elif username == "test" and password == "test":
      request.session["SIGNED-IN"] = True  # 設置 session 中的 SIGNED-IN
      return RedirectResponse(url="/member", status_code=303)
    else:
      return RedirectResponse(
        url="/error?message=Username+or+password+is+not+correct", 
        status_code=303
      )
  else:
    return RedirectResponse(url="/", status_code=303)
  
@app.get("/member", response_class=HTMLResponse)
def member_page(request: Request):
  if not request.session.get("SIGNED-IN"): 
    return RedirectResponse(url="/", status_code=303)
  return templates.TemplateResponse(request=request, name="member.html")

@app.get("/error", response_class=HTMLResponse)
def error_page(request: Request, message: str):
  return templates.TemplateResponse(request=request, name="error.html", context={"message": message})

# err_msg = [{"message": "Please enter username and password"}, {"message": "Username or password is not correct"}]

@app.get("/signout", response_class=HTMLResponse)
def signout(request: Request):
  request.session.clear()
  return RedirectResponse(url="/", status_code=303)

@app.get("/square/{num}", response_class=HTMLResponse)
def square(request: Request, num: int):
  num2 = num * num
  return templates.TemplateResponse(request=request, name="square.html", context={"num2": num2})

# 可以直接跑 python 把 app.py 傳入 uvicorn 來執行
if __name__ == "__main__":
  import uvicorn
  uvicorn.run("app:app", reload=True)