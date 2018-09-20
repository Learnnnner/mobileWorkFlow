package audit;

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

public class RecallForm {
    public static void recall(RoutingContext routingContext, Vertx vertx) {
        Future<SQLConnection> connfuture = Future.future();

        JsonObject jsonObject = routingContext.getBodyAsJson();
        String dataId = ConvertTool.toString(jsonObject.getString("dataId"));

        JsonObject data = new JsonObject();

        if (!StringTool.isEmpty(dataId)) {
            DataAccess dataAccess = DataAccess.create(vertx);
            dataAccess.getJDBCClient().getConnection(connfuture);
            String statusNow = "";
            String statusFinal = "已退审";
            String dealer = "";
            JsonArray params = new JsonArray();
            params.add(statusNow).add(statusFinal).add(dealer).add(dataId);
            String updateSql = "Update form_data set status_now = ?, status_final = ?, dealer = ? where id = ?";

            Future<ResultSet> recallFuture = Future.future();

            recallFuture.setHandler(asyncResult -> {
                if(asyncResult.succeeded()) {
                    data.put("status", 200);
                    routingContext.response().setStatusCode(200).end(Json.encodePrettily(data));
                }else {
                    data.put("status", 500);
                    routingContext.response().setStatusCode(500).end(Json.encodePrettily(data));
                }
                connfuture.result().close();
            });

            connfuture.setHandler(asyncResult -> {
                if(asyncResult.succeeded()) {
                    asyncResult.result().queryWithParams(updateSql, params, recallFuture);
                } else {
                    asyncResult.cause().printStackTrace();
                }
            });
        }
    }
}
