package auth;

import database.DataAccess;
import io.vertx.core.Future;
import io.vertx.core.Vertx;
import io.vertx.core.json.Json;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.sql.ResultSet;
import io.vertx.ext.sql.SQLConnection;
import io.vertx.ext.web.RoutingContext;
import io.vertx.ext.web.Session;
import tool.ConvertTool;
import tool.StringTool;

import java.util.List;

public class QueryAuthList {
    public static void query(RoutingContext routingContext, Vertx vertx) {
        Future<SQLConnection> connfuture = Future.future();
        Future<ResultSet> resultFuture = Future.future();
        JsonObject jsonObject = routingContext.getBodyAsJson();
        String id = jsonObject.getString("id");


        if (!StringTool.isEmpty(id)) {
            DataAccess dataAccess = DataAccess.create(vertx);
            dataAccess.getJDBCClient().getConnection(connfuture);

            JsonArray params = new JsonArray();
            String sql = "SELECT function_id FROM function_org_relation Where org_id = ?";
            params.add(id);

            resultFuture.setHandler(asyncResult -> {
                if(asyncResult.succeeded()) {
                    ResultSet rs = asyncResult.result();
                    List<JsonArray> data = rs.getResults();

                    jsonObject.put("status", 200);
                    jsonObject.put("data", data);
                    routingContext.response().setStatusCode(200).end(Json.encodePrettily(jsonObject));
                } else {
                    jsonObject.put("status", 500);
                    jsonObject.put("message", "数据库查询异常");
                    routingContext.response().setStatusCode(500).end(Json.encodePrettily(jsonObject));
                }
                connfuture.result().close();
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
