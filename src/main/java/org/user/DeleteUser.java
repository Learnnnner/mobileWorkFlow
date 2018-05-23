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

public class DeleteUser {
    public static void delete(RoutingContext routingContext, Vertx vertx) {
        JsonObject jsonObject = routingContext.getBodyAsJson();
        String id = ConvertTool.toString(jsonObject.getInteger("id"));

        JsonArray param = new JsonArray().add(id);

        Future<SQLConnection> connfuture = Future.future();
//        Future<UpdateResult> resultFuture = Future.future();

        if (!StringTool.isEmpty(id)) {

            DataAccess dataAccess = DataAccess.create(vertx);
            dataAccess.getJDBCClient().getConnection(connfuture);

            String sql = "delete from org_user where id = ?";
            String sqlR = "delete from org_user_relation where userId = ?";

            connfuture.setHandler(asyncResult -> {
                final SQLConnection connection = asyncResult.result();
                connection.setAutoCommit(false, res -> {
                    if (res.succeeded()) {
                        Future.<UpdateResult>future(f ->
                                connection.updateWithParams(sql, param, f)
                        ).compose(f1 ->
                                Future.<UpdateResult>future(f ->
                                        connection.updateWithParams(sqlR, param, f)
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

//        if (!StringTool.isEmpty(id)) {
//
//            DataAccess dataAccess = DataAccess.create(vertx);
//            dataAccess.getJDBCClient().getConnection(connfuture);
//
//            String sql = "delete form org_user where id = ?";
//
//
//
//            resultFuture.setHandler(asyncResult -> {
//                if(asyncResult.succeeded()) {
//                    jsonObject.put("status", 200);
//                    routingContext.response().setStatusCode(200).end(Json.encodePrettily(jsonObject));
//                } else {
//                    jsonObject.put("status", 500);
//                    jsonObject.put("message", "数据库操作异常");
//                    routingContext.response().setStatusCode(500).end(Json.encodePrettily(jsonObject));
//                }
//            });
//
//            connfuture.setHandler(asyncResult -> {
//                if(asyncResult.succeeded()) {
//                    asyncResult.result().updateWithParams(sql, param, resultFuture);
//                } else {
//                    asyncResult.cause().printStackTrace();
//                }
//            });
//        }
    }
}
