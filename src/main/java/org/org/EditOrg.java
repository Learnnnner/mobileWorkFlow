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
        Future<UpdateResult> resultFuture = Future.future();
        JsonObject jsonObject = routingContext.getBodyAsJson();
        String id = ConvertTool.toString(jsonObject.getString("id"));
        String name = ConvertTool.toString(jsonObject.getString("name"));
        String description = ConvertTool.toString(jsonObject.getString("description"));

        if (!StringTool.isEmpty(id)) {
            DataAccess dataAccess = DataAccess.create(vertx);
            dataAccess.getJDBCClient().getConnection(connfuture);

            JsonArray params = new JsonArray();
            params.add(name).add(description).add(id);

            String sql = "update org_org set name = ?, description = ? where id = ?";

            resultFuture.setHandler(asyncResult -> {
                if(asyncResult.succeeded()) {
                    jsonObject.put("status", 200);
                    routingContext.response().setStatusCode(200).end(Json.encodePrettily(jsonObject));
                } else {
                    jsonObject.put("status", 500);
                    jsonObject.put("message", "数据库操作异常！");
                    routingContext.response().setStatusCode(500).end(Json.encodePrettily(jsonObject));
                }
            });

            connfuture.setHandler(asyncResult -> {
                if(asyncResult.succeeded()) {
                    asyncResult.result().updateWithParams(sql, params, resultFuture);
                }else {
                    asyncResult.cause().printStackTrace();
                }
            });
        }
    }
}
