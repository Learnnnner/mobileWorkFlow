package org.org;

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

public class EditOrg {
    public static void update(RoutingContext routingContext, Vertx vertx) {
        Future<SQLConnection> connfuture = Future.future();
        JsonObject jsonObject = routingContext.getBodyAsJson();
        String id = ConvertTool.toString(jsonObject.getString("id"));
        String name = ConvertTool.toString(jsonObject.getString("name"));
        String description = ConvertTool.toString(jsonObject.getString("description"));
        JsonArray authorization = jsonObject.getJsonArray("authorization");

        if (!StringTool.isEmpty(id)) {
            DataAccess dataAccess = DataAccess.create(vertx);
            dataAccess.getJDBCClient().getConnection(connfuture);

            JsonArray params = new JsonArray();
            JsonArray deleteparams = new JsonArray();
            params.add(name).add(description).add(id);
            deleteparams.add(id);

            String sql = "update org_org set name = ?, description = ? where id = ?";
            String deleteSql = "Delete from function_org_relation where org_id = ?";
            String InsertSql = "Insert into function_org_relation values (?, ?)";

            connfuture.setHandler(asyncResult -> {
                if(asyncResult.succeeded()) {
                    SQLConnection connection = connfuture.result();
                    connection.setAutoCommit(false, res->{});
                    connection.updateWithParams(sql, params, res -> {
                        if (res.failed()) {
                            connection.rollback(res1 -> {
                                jsonObject.clear().put("status", 500);
                                routingContext.response().setStatusCode(500).end(Json.encodePrettily(jsonObject));
                                connection.close();
                                return;
                            });
                        }else {
                            connection.updateWithParams(deleteSql, deleteparams, res2 -> {
                                if (res2.failed()){
                                    connection.rollback(res1 -> {
                                        jsonObject.clear().put("status", 500);
                                        routingContext.response().setStatusCode(500).end(Json.encodePrettily(jsonObject));
                                        connection.close();
                                        return;
                                    });
                                }else {
                                    connection.updateWithParams(deleteSql, deleteparams, res3 -> {
                                        for (int i = 0; i < authorization.size(); ++ i) {
                                            JsonArray relationParam = new JsonArray().add(authorization.getString(i)).add(id);
                                            connection.updateWithParams(InsertSql, relationParam, res4->{
                                                if (res.failed()) {
                                                    jsonObject.clear().put("status", 500);
                                                    routingContext.response().setStatusCode(500).end(Json.encodePrettily(jsonObject));
                                                    connection.rollback(res1 -> {
                                                        connection.close();
                                                        return;
                                                    });
                                                }
                                            });
                                        }


                                        connection.commit(res5 -> {
                                            if (res.succeeded()) {
                                                jsonObject.clear().put("status", 200);
                                                routingContext.response().setStatusCode(200).end(Json.encodePrettily(jsonObject));
                                                connection.close();
                                            } else {
                                                jsonObject.clear().put("status", 500);
                                                routingContext.response().setStatusCode(500).end(Json.encodePrettily(jsonObject));
                                                connection.close();
                                            }
                                        });
                                    });
                                }
                            });
                        }
                    });


                }else {
                    asyncResult.cause().printStackTrace();
                }
            });
        }
    }
}
