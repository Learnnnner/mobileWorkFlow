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
import io.vertx.ext.web.Session;
import tool.ConvertTool;
import tool.StringTool;

import java.util.List;

public class QuerySubmitForms {
    public static void query(RoutingContext routingContext, Vertx vertx) {
        Future<SQLConnection> connfuture = Future.future();
        Future<ResultSet> resultFuture = Future.future();
        Session session = routingContext.session();

        JsonObject jsonObject = new JsonObject();
        String id = session.get("userId");


        if (!StringTool.isEmpty(id)) {
            DataAccess dataAccess = DataAccess.create(vertx);
            dataAccess.getJDBCClient().getConnection(connfuture);

            JsonArray params = new JsonArray();
            params.add(id).add("%" + id + "%");
            String sql = "SELECT * FROM v_user_template_data where userId = ? OR dealer like ?";

            resultFuture.setHandler(asyncResult -> {
                if(asyncResult.succeeded()) {
                    ResultSet rs = asyncResult.result();
                    List<JsonArray> data = rs.getResults();
                    JsonArray mysubmit = new JsonArray();
                    JsonArray tosubmit = new JsonArray();

                    JsonObject formData = new JsonObject();


                    for (int i = 0; i < data.size(); ++ i) {
                        if(data.get(i).getInteger(0).toString().equals(id)){
                            mysubmit.add(data.get(i));
                        }else if(new JsonArray(data.get(i).getString(10)).contains(id)) {
                            tosubmit.add(data.get(i));
                        }else {
                            continue;
                        }
                    }

                    formData.put("mysubmit", mysubmit);
                    formData.put("tosubmit", tosubmit);

                    jsonObject.put("status", 200);
                    jsonObject.put("data", formData);
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
