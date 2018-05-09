package org;

import database.DataAccess;
import io.vertx.core.Future;
import io.vertx.core.Vertx;
import io.vertx.core.json.Json;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.sql.ResultSet;
import io.vertx.ext.sql.SQLConnection;
import io.vertx.ext.web.RoutingContext;
import tool.ConvertTool;
import tool.StringTool;

import java.util.List;

public class DeleteOrg {
    public static void delete(RoutingContext routingContext, Vertx vertx) {
        Future<SQLConnection> connfuture = Future.future();
        Future<ResultSet> resultFuture = Future.future();
        JsonObject jsonObject = routingContext.getBodyAsJson();
        String id = ConvertTool.toString(jsonObject.getString("id"));

        if (!StringTool.isEmpty(id)) {
            DataAccess dataAccess = DataAccess.create(vertx);
            dataAccess.getJDBCClient().getConnection(connfuture);

            JsonArray params = new JsonArray();
            params.add(id);

            String sql = "Delete FROM org_org where id = ?";

            resultFuture.setHandler(asyncResult -> {
                if(asyncResult.succeeded()) {
                    jsonObject.put("status", 200);
                    routingContext.response().setStatusCode(200).end(Json.encodePrettily(jsonObject));
                } else {
                    jsonObject.put("status", 500);
                    jsonObject.put("message", "数据库操作异常");
                    routingContext.response().setStatusCode(500).end(Json.encodePrettily(jsonObject));
                }
            });

            connfuture.setHandler(asyncResult -> {
                if(asyncResult.succeeded()) {
                    asyncResult.result().queryWithParams(sql, params, resultFuture);
                }else {
                    asyncResult.cause().printStackTrace();
                }
            });
        }
    }
}
