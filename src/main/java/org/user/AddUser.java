package org.user;

import database.DataAccess;
import io.vertx.core.Future;
import io.vertx.core.Vertx;
import io.vertx.core.json.Json;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.sql.SQLConnection;
import io.vertx.ext.sql.UpdateResult;
import io.vertx.ext.web.RoutingContext;
import tool.ConvertTool;
import tool.StringTool;

public class AddUser {
    public static void add(RoutingContext routingContext, Vertx vertx) {
        JsonObject jsonObject = routingContext.getBodyAsJson();
        String id = ConvertTool.toString(jsonObject.getString("id"));
        String realname = ConvertTool.toString(jsonObject.getString("realname"));
        String loginname = ConvertTool.toString(jsonObject.getString("loginname"));
        String password = ConvertTool.toString(jsonObject.getString("password"));
        String telephone = ConvertTool.toString(jsonObject.getString("telephone"));
        String email = ConvertTool.toString(jsonObject.getString("email"));
        String enable = ConvertTool.toString(jsonObject.getString("enable"));
        String department = ConvertTool.toString(jsonObject.getString("orgid"));

        JsonArray param = new JsonArray()
                .add(id)
                .add(loginname)
                .add(realname)
                .add(password)
                .add(telephone)
                .add(email)
                .add(enable);

        JsonArray paramR = new JsonArray()
                .add(department).add(id);

        Future<SQLConnection> connfuture = Future.future();

        if (!StringTool.isEmpty(id) && !StringTool.isEmpty(loginname) && !StringTool.isEmpty(password)) {

            DataAccess dataAccess = DataAccess.create(vertx);
            dataAccess.getJDBCClient().getConnection(connfuture);

            String sql = "Insert into org_user values (?, ?, ?, ?, ?, ?, ?, 1)";
            String sqlR = "Insert into org_user_relation values (?, ?, null)";

            connfuture.setHandler(asyncResult -> {
                final SQLConnection connection = asyncResult.result();
                connection.setAutoCommit(false, res -> {
                    if (res.succeeded()) {
                        Future.<UpdateResult>future(f ->
                                connection.updateWithParams(sql, param, f)
                        ).compose(f1 ->
                                Future.<UpdateResult>future(f ->
                                        connection.updateWithParams(sqlR, paramR, f)
                        )).setHandler((f2) -> {
                            if(f2.failed()) {
                                connection.rollback(roll -> {
                                    if (roll.succeeded()) {
                                        jsonObject.clear().put("status", 500);
                                        routingContext.response().setStatusCode(500).end("rollback ok");
                                        connection.close();
                                    } else {
                                        routingContext.response().setStatusCode(500).end("rollback error");
                                        connection.close();
                                    }
                                });
                            } else {
                                connection.commit(commit -> {
                                    if (commit.succeeded()) {
                                        jsonObject.clear().put("status", 200);
                                        routingContext.response().setStatusCode(200).end(Json.encodePrettily(jsonObject));
                                        connection.close();
                                    } else {
                                        routingContext.response().end("commit error");
                                        connection.close();
                                    }
                                });

                            }
                        });
                    } else {
                        jsonObject.clear().put("status", 500);
                        jsonObject.put("message", "数据库操作异常");
                        routingContext.response().setStatusCode(500).end(Json.encodePrettily(jsonObject));
                    }
                });
            });
        }
    }
}
