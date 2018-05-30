package workflow.template;

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

public class AddTemplate {
    public static void add(RoutingContext routingContext, Vertx vertx) {
        JsonObject jsonObject = routingContext.getBodyAsJson();
        String title = ConvertTool.toString(jsonObject.getString("title"));
        String attributes = ConvertTool.toString(jsonObject.getJsonObject("body"));
        String timeStamp = ConvertTool.toString(jsonObject.getLong("timeStamp"));
        String elementCount = ConvertTool.toString(jsonObject.getInteger("elementCount"));
        String designer = jsonObject.getString("designer");

        JsonArray param = new JsonArray()
                .add(title)
                .add(attributes)
                .add(designer)
                .add(elementCount)
                .add(timeStamp);

        Future<SQLConnection> connfuture = Future.future();
        Future<UpdateResult> resultFuture = Future.future();

        if (!StringTool.isEmpty(title)) {

            DataAccess dataAccess = DataAccess.create(vertx);
            dataAccess.getJDBCClient().getConnection(connfuture);

            String sql = "Insert into form_templates(title, attribute_set, designer_id, element_count, time_stamp) values (?, ?, ?, ?, ?)";

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
