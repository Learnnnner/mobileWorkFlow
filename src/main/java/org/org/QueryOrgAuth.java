package org.org;

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

import java.util.ArrayList;
import java.util.List;

public class QueryOrgAuth {
    public static void query(RoutingContext routingContext, Vertx vertx) {
        Future<SQLConnection> connfuture = Future.future();
        Future<ResultSet> resultFuture = Future.future();
        JsonObject jsonObject = new JsonObject();

        DataAccess dataAccess = DataAccess.create(vertx);
        dataAccess.getJDBCClient().getConnection(connfuture);

        String orgSql = "SELECT * FROM org_org";
        String authSql = "SELECT * FROM function_org_relation";

        resultFuture.setHandler(asyncResult -> {
            if(asyncResult.succeeded()) {
                ResultSet rs = asyncResult.result();
                List<JsonArray> orgList = rs.getResults();
                JsonArray orgArray = new JsonArray(orgList);

                connfuture.result().query(authSql,res -> {
                    if(res.succeeded()) {
                        List<JsonArray> authList = res.result().getResults();
                        JsonObject authOrg = new JsonObject();
                        for (JsonArray jsonArray : authList) {
                            if(authOrg.getJsonArray(ConvertTool.toString(jsonArray.getInteger(1))) == null) {
                                String k = ConvertTool.toString(jsonArray.getInteger(1));
                                String v = ConvertTool.toString(jsonArray.getInteger(0));
                                JsonArray temp = new JsonArray();
                                temp.add(v);
                                authOrg.put(k, temp);
                            } else {
                                JsonArray ja = authOrg.getJsonArray(ConvertTool.toString(jsonArray.getInteger(1)));
                                ja.add(ConvertTool.toString(jsonArray.getInteger(0)));
                            }
                        }
                        jsonObject.put("status", 200);
                        jsonObject.put("orgList", orgArray);
                        jsonObject.put("authList", authOrg);
                        routingContext.response().setStatusCode(200).end(Json.encodePrettily(jsonObject));
                    }
                });
            } else {
                jsonObject.put("status", 500);
                jsonObject.put("message", "数据库查询异常");
                routingContext.response().setStatusCode(500).end(Json.encodePrettily(jsonObject));
            }
            connfuture.result().close();
        });

        connfuture.setHandler(asyncResult -> {
            if(asyncResult.succeeded()) {
                asyncResult.result().query(orgSql, resultFuture);
            }else {
                asyncResult.cause().printStackTrace();
            }
        });
    }
}
