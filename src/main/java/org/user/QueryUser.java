package org.user;

import database.DataAccess;
import io.vertx.core.Future;
import io.vertx.core.Vertx;
import io.vertx.core.json.Json;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.sql.ResultSet;
import io.vertx.ext.sql.SQLConnection;
import io.vertx.ext.web.RoutingContext;

import java.util.List;

public class QueryUser {
    public static void query(RoutingContext routingContext, Vertx vertx) {
        Future<SQLConnection> connfuture = Future.future();
        Future<ResultSet> resultFuture = Future.future();
        JsonObject jsonObject = new JsonObject();

        DataAccess dataAccess = DataAccess.create(vertx);
        dataAccess.getJDBCClient().getConnection(connfuture);

        String sql = "SELECT * FROM v_org_user";

        resultFuture.setHandler(asyncResult -> {
            if(asyncResult.succeeded()) {
                ResultSet rs = asyncResult.result();
                List<JsonArray> data = rs.getResults();
                JsonArray jsonArray = new JsonArray(data);
                jsonObject.put("status", 200);
                jsonObject.put("data", jsonArray);
                routingContext.response().setStatusCode(200).end(Json.encodePrettily(jsonObject));
            } else {
                jsonObject.put("status", 500);
                jsonObject.put("message", "数据库查询异常");
                routingContext.response().setStatusCode(500).end(Json.encodePrettily(jsonObject));
            }
        });

        connfuture.setHandler(asyncResult -> {
            if(asyncResult.succeeded()) {
                asyncResult.result().query(sql, resultFuture);
            }else {
                asyncResult.cause().printStackTrace();
            }
        });
    }
}
