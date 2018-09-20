package form;

import database.DataAccess;
import io.vertx.core.Future;
import io.vertx.core.Vertx;
import io.vertx.core.json.Json;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.sql.ResultSet;
import io.vertx.ext.sql.SQLConnection;
import io.vertx.ext.web.RoutingContext;
import tool.StringTool;

import java.util.List;

public class QueryReEditData {
    public static void query(RoutingContext routingContext, Vertx vertx) {
        Future<SQLConnection> connfuture = Future.future();

        JsonObject jsonObject = routingContext.getBodyAsJson();
        String id = jsonObject.getString("id");
        String dataId = jsonObject.getString("dataId");
        JsonObject data = new JsonObject();

        Future<ResultSet> templateFuture = Future.future();
        Future<ResultSet> dataFuture = Future.future();

        if (!StringTool.isEmpty(dataId) && !StringTool.isEmpty(dataId)) {
            DataAccess dataAccess = DataAccess.create(vertx);
            dataAccess.getJDBCClient().getConnection(connfuture);
            JsonArray templateParams = new JsonArray();
            JsonArray dataParams = new JsonArray();

            templateParams.add(id);
            dataParams.add(dataId);

            String templateSql = "SELECT title, attribute_set FROM form_templates where id = ?";
            String dataSql = "SELECT data_set FROM form_data where id = ?";

            connfuture.setHandler(asyncResult -> {
                if(asyncResult.succeeded()) {
                    final SQLConnection connection = asyncResult.result();
                    connection.queryWithParams(templateSql, templateParams, templateFuture);
                    templateFuture.compose(res1 -> {
                        List<JsonArray> template = res1.getResults();
                        JsonArray templateArray = new JsonArray(template);
                        data.put("template", templateArray);
                        return templateFuture;
                    }).compose(res2-> {
                        connfuture.result().queryWithParams(dataSql, dataParams, dataFuture);
                        return dataFuture;
                    }).setHandler(res-> {
                        if(res.succeeded()) {
                            ResultSet rs2 = res.result();
                            List<JsonArray> userdata = rs2.getResults();
                            JsonArray dataArray = new JsonArray(userdata);
                            data.put("data", dataArray);
                            data.put("status", 200);
                            routingContext.response().setStatusCode(200).end(Json.encodePrettily(data));
                        }else {
                            data.put("status", 500);
                            routingContext.response().setStatusCode(500).end(Json.encodePrettily(data));
                        }
                    });
                } else {
                    asyncResult.cause().printStackTrace();
                }
            });
        }
    }
}
