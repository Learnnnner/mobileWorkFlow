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
import tool.StringTool;

import java.util.List;

public class QueryFormAuth {
    public static void query(RoutingContext routingContext, Vertx vertx) {
        Session session = routingContext.session();
        String userId = session.get("userId");
        String authId = routingContext.getBodyAsJson().getString("id");

        Future<SQLConnection> connfuture = Future.future();
        Future<ResultSet> resultFuture = Future.future();
        Future<ResultSet> urlFuture = Future.future();

        if (!StringTool.isEmpty(userId)) {

            DataAccess dataAccess = DataAccess.create(vertx);
            dataAccess.getJDBCClient().getConnection(connfuture);

            String sql = "SELECT id FROM v_org_user where userId = ?";
            JsonArray params = new JsonArray().add(userId);

            resultFuture.setHandler(asyncResult -> {
                if (asyncResult.succeeded()) {
                    ResultSet rs = asyncResult.result();
                    List resultList = rs.getResults();
                    JsonArray orgArray = (JsonArray) resultList.get(0);
                    Integer orgId = orgArray.getInteger(0);
                    String urlSql = "SELECT url FROM v_org_func where org_id = ? and function_id = ?";
                    JsonArray urlParams = new JsonArray().add(orgId).add(authId);
                    connfuture.result().queryWithParams(urlSql, urlParams, res1 -> {
                        if (res1.succeeded()) {
                            ResultSet rs1 = res1.result();
                            List urlList = rs1.getResults();
                            if(urlList.size() == 1) {
                                JsonObject data = new JsonObject();
                                data.put("status", 200);
                                data.put("url", urlList);
                                routingContext.response().setStatusCode(200).end(Json.encodePrettily(data));
                            }else {
                                JsonObject data = new JsonObject();
                                data.put("status", 500);
                                routingContext.response().setStatusCode(500).end(Json.encodePrettily(data));
                            }
                        }else {
                            JsonObject data = new JsonObject();
                            data.put("status", 500);
                            routingContext.response().setStatusCode(500).end(Json.encodePrettily(data));
                        }
                    });
                }
            });

            connfuture.setHandler(asyncResult -> {
                if(asyncResult.succeeded()) {
                    asyncResult.result().queryWithParams(sql, params, resultFuture);
                } else {
                    asyncResult.cause().printStackTrace();
                }
            });
        }

    }
}
