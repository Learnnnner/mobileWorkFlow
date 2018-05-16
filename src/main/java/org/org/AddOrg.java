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

public class AddOrg {
    public static void add(RoutingContext routingContext, Vertx vertx) {
        JsonObject jsonObject = routingContext.getBodyAsJson();
        String id = ConvertTool.toString(jsonObject.getString("id"));
        String name = ConvertTool.toString(jsonObject.getString("name"));
        String description = ConvertTool.toString(jsonObject.getString("description"));

        JsonArray param = new JsonArray().add(id).add(name).add(description);

        Future<SQLConnection> connfuture = Future.future();
        Future<UpdateResult> resultFuture = Future.future();

        if (!StringTool.isEmpty(id) && !StringTool.isEmpty(name)) {

            DataAccess dataAccess = DataAccess.create(vertx);
            dataAccess.getJDBCClient().getConnection(connfuture);

            String sql = "Insert into org_org values (?,?,1,0,0,?)";

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
                    asyncResult.result().updateWithParams(sql, param, resultFuture);
                } else {
                    asyncResult.cause().printStackTrace();
                }
            });
        }
    }
}