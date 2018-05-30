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

public class UpdateTemplate {
    public static void update(RoutingContext routingContext, Vertx vertx) {
        JsonObject jsonObject = routingContext.getBodyAsJson();
        String id = ConvertTool.toString(jsonObject.getString("id"));
        String dataString = ConvertTool.toString(jsonObject.getString("data"));

        JsonObject data = new JsonObject(dataString);

        String attribute = ConvertTool.toString(data.getJsonObject("body")) ;
        String designer = data.getString("designer");
        String elementCount = ConvertTool.toString(data.getInteger("elementCount"));
        String timeStamp = ConvertTool.toString(data.getLong("timeStamp"));

        JsonArray param = new JsonArray()
                .add(attribute)
                .add(designer)
                .add(elementCount)
                .add(timeStamp)
                .add(id);

        Future<SQLConnection> connfuture = Future.future();
        Future<UpdateResult> resultFuture = Future.future();

        if (!StringTool.isEmpty(id)) {

            DataAccess dataAccess = DataAccess.create(vertx);
            dataAccess.getJDBCClient().getConnection(connfuture);

            String sql = "update form_templates set attribute_set = ?, designer_id = ?, element_count = ?, time_stamp = ? where id = ?";

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
