package PC;

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

public class Profile {
    public static void query(RoutingContext routingContext, Vertx vertx) {
        JsonObject jsonObject = routingContext.getBodyAsJson();
        String id = ConvertTool.toString(jsonObject.getString("id"));

        Future<SQLConnection> connfuture = Future.future();
        Future<ResultSet> resultFuture = Future.future();
        Future<ResultSet> sqlResultFuture = Future.future();

        if (!StringTool.isEmpty(id)) {
            DataAccess dataAccess = DataAccess.create(vertx);
            dataAccess.getJDBCClient().getConnection(connfuture);

            String sql = "SELECT * FROM v_org_user where userId = ?";
            String orgSql = "SELECT * FROM org_org";
            JsonArray params = new JsonArray();
            JsonObject data = new JsonObject();

            params.add(id);
//            resultFuture.setHandler(asyncResult -> {
//                if(asyncResult.succeeded()) {
//                    ResultSet rs = asyncResult.result();
//                    List<JsonArray> data = rs.getResults();
//                    if(data.size() == 1) {
//                        jsonObject.put("status", 200);
//                        jsonObject.put("data", data);
//                        jsonObject.put("message", "登陆成功");
//                        routingContext.response().setStatusCode(200).end(Json.encodePrettily(jsonObject));
//                    } else {
//                        jsonObject.put("status", 500);
//                        jsonObject.put("message", "查询信息出错，请联系管理员解决");
//                        routingContext.response().setStatusCode(500).end(Json.encodePrettily(jsonObject));
//                    }
//                }
//                connfuture.result().close();
//            });
//
//            connfuture.setHandler(asyncResult -> {
//                if(asyncResult.succeeded()) {
//                    asyncResult.result().queryWithParams(sql, params, resultFuture);
//                } else {
//                    asyncResult.cause().printStackTrace();
//                }
//            });

            connfuture.setHandler(asyncResult -> {
                if(asyncResult.succeeded()) {
                    final SQLConnection connection = asyncResult.result();
                    connection.queryWithParams(sql, params, resultFuture);
                    resultFuture.compose(res1 -> {
                        List<JsonArray> template = res1.getResults();
                        JsonArray templateArray = new JsonArray(template);
                        data.put("user", templateArray);
                        return resultFuture;
                    }).compose(res2-> {
                        connfuture.result().query(orgSql, sqlResultFuture);
                        return sqlResultFuture;
                    }).setHandler(res-> {
                        if(res.succeeded()) {
                            ResultSet rs2 = res.result();
                            List<JsonArray> userdata = rs2.getResults();
                            JsonArray dataArray = new JsonArray(userdata);
                            data.put("orgs", dataArray);
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
