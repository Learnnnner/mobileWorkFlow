package action;

import database.DataAccess;
import io.vertx.core.Future;
import io.vertx.core.Vertx;
import io.vertx.core.json.Json;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.sql.ResultSet;
import io.vertx.ext.sql.SQLConnection;
import io.vertx.ext.web.Cookie;
import io.vertx.ext.web.RoutingContext;
import io.vertx.ext.web.Session;
import tool.ConvertTool;
import tool.StringTool;

import java.util.List;

public class LoginService {

    public void loginCheckUser(RoutingContext routingContext, Vertx vertx) {
        JsonObject jsonObject = routingContext.getBodyAsJson();
        String username = ConvertTool.toString(jsonObject.getString("username"));
        String password = ConvertTool.toString(jsonObject.getString("password"));

        Future<SQLConnection> connfuture = Future.future();
        Future<ResultSet> resultFuture = Future.future();

        if (!StringTool.isEmpty(username) && !StringTool.isEmpty(password)) {

            DataAccess dataAccess = DataAccess.create(vertx);
            dataAccess.getJDBCClient().getConnection(connfuture);

            String sql = "SELECT * FROM org_user where loginname = ?";
            JsonArray params = new JsonArray();
            params.add(username);

            resultFuture.setHandler(asyncResult -> {
                if(asyncResult.succeeded()) {
                    ResultSet rs = asyncResult.result();
                    List<JsonArray> data = rs.getResults();
                    if(data.size() == 1) {
                        if(data.get(0).getString(1).equals(username) &&data.get(0).getString(3).equals(password)) {
                            jsonObject.put("status", 200);
                            jsonObject.put("message", "登陆成功");
                            Session session = routingContext.session();
                            Integer userId = data.get(0).getInteger(0);
                            String loginname = data.get(0).getString(1);
                            session.put("loginname", loginname);
                            session.put("userId", ConvertTool.toString(userId));
                            routingContext.addCookie(Cookie.cookie("loginname", loginname))
                                    .addCookie(Cookie.cookie("userId", ConvertTool.toString(userId)));
                            routingContext.response().setStatusCode(200).end(Json.encodePrettily(jsonObject));
                        } else {
                            jsonObject.put("status", 500);
                            jsonObject.put("message", "用户名或者密码错误");
                            routingContext.response().setStatusCode(500).end(Json.encodePrettily(jsonObject));
                        }
                    } else {
                        jsonObject.put("status", 500);
                        jsonObject.put("message", "服务出现错误，请联系管理员解决");
                        routingContext.response().setStatusCode(500).end(Json.encodePrettily(jsonObject));
                    }
                } else {

                }
                connfuture.result().close();
            });

            connfuture.setHandler(asyncResult -> {
                if(asyncResult.succeeded()) {
                    asyncResult.result().queryWithParams(sql, params, resultFuture);
                } else {
                    asyncResult.cause().printStackTrace();
                }
            });
        }
    }

    public void login(RoutingContext routingContext, Vertx vertx) {
        this.loginCheckUser(routingContext, vertx);
    }
}
