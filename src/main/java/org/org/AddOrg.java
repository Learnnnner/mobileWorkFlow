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

import java.sql.Connection;

public class AddOrg {
    public static void add(RoutingContext routingContext, Vertx vertx) {
        JsonObject jsonObject = routingContext.getBodyAsJson();
        String id = ConvertTool.toString(jsonObject.getString("id"));
        String name = ConvertTool.toString(jsonObject.getString("name"));
        String description = ConvertTool.toString(jsonObject.getString("description"));
        JsonArray authorization = jsonObject.getJsonArray("authorization");

        JsonArray param = new JsonArray().add(id).add(name).add(description);

        Future<SQLConnection> connfuture = Future.future();
        Future<UpdateResult> resultFuture = Future.future();

        if (!StringTool.isEmpty(id) && !StringTool.isEmpty(name)) {

            DataAccess dataAccess = DataAccess.create(vertx);
            dataAccess.getJDBCClient().getConnection(connfuture);

            String sql = "Insert into org_org values (?, ?, ?)";
            String relationsql = "Insert into function_org_relation values (?, ?)";

            connfuture.setHandler(asyn-> {
                if(asyn.succeeded()) {
                    SQLConnection connection = connfuture.result();
                    connection.setAutoCommit(false, res->{});
                    connection.updateWithParams(sql, param, res->{
                        if (res.failed()){
                            connection.rollback(res1 -> {
                                jsonObject.clear().put("status", 500);
                                routingContext.response().setStatusCode(500).end(Json.encodePrettily(jsonObject));
                                connection.close();
                                return;
                            });
                        }
                    });

                    for (int i = 0; i < authorization.size(); ++ i) {
                        JsonArray relationParam = new JsonArray().add(authorization.getInteger(i)).add(id);
                        connection.updateWithParams(relationsql, relationParam, res->{
                            if (res.failed()){
                                jsonObject.clear().put("status", 500);
                                routingContext.response().setStatusCode(500).end(Json.encodePrettily(jsonObject));
                                connection.rollback(res1 -> {
                                    connection.close();
                                    return;
                                });
                            }
                        });
                    }

                    connection.commit(res-> {
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
                }
            });
        }
    }
}
