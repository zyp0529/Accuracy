import uvicorn
# import aioredis
from starlette.responses import JSONResponse
from fastapi import FastAPI, Request
from initialize import init_app
from app.PersonnelManagement.Users.permissions import Permissions
from sql_models.db_config import async_session_local

app = FastAPI(title="Accuracy",
              version="1.0")

# 初始化app
init_app(app)


@app.get("/")
async def read_root():
    return {"Hello": "Accuracy"}


# 中间件
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    response = await call_next(request)
    # # 判断不是登录接口的链接就验证token
    path = str(request.url.path)
    if path == '/api/PersonnelManagement/users/v1/login' \
            or path == '/docs' or path == '/redocs' or path == '/openapi.json':
        return response

    try:
        token = request.headers["Authorization"]
        user_id, account, name = await Permissions.verify(token)
        request.state.user_id = user_id
        request.state.account = account
        request.state.username = name
    except Exception as e:

        return JSONResponse(status_code=401, content={"detail": str(e)})

    return response


# # 在FastAPI创建前创建Redis连接
# @app.on_event("startup")
# async def startup_event():
#     app.state.redis = await aioredis.from_url("redis://45.63.5.115", port=6379, db=3, encoding="utf-8",
#                                               password='4242587')
#     print(f"redis连接成功--->>{app.state.redis}")
#
#
# # 在FastAPI关闭时关闭Redis连接
# @app.on_event("shutdown")
# async def shutdown_event():
#     app.state.redis.close()
#     await app.state.redis.wait_closed()


if __name__ == '__main__':
    uvicorn.run('main:app', host="0.0.0.0", port=8000, reload=True)
