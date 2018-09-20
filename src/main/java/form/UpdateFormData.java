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

public class UpdateFormData {
    public static void update(RoutingContext routingContext, Vertx vertx) {
        JsonObject jsonObject = routingContext.getBodyAsJson();
        Session session = routingContext.session();
        String userId = session.get("userId");
        String dataSet = jsonObject.getString("data");
        JsonObject dataSetJson = new JsonObject(dataSet);
        String timeStamp = ConvertTool.toString(jsonObject.getLong("timeStamp"));
        String templateId = jsonObject.getString("templateId");
        String dataId = jsonObject.getString("dataId");

        Future<SQLConnection> connfuture = Future.future();
        Future<ResultSet> queryStatusFuture = Future.future();
        if(!StringTool.isEmpty(userId)) {

            JsonArray queryParam = new JsonArray();
            queryParam.add(templateId);

            DataAccess dataAccess = DataAccess.create(vertx);
            dataAccess.getJDBCClient().getConnection(connfuture);

            String queryTemplate = "Select * from form_templates where id = ?";

            queryStatusFuture.setHandler(asyncResult -> {
                if(asyncResult.succeeded()) {
                    final SQLConnection connection = connfuture.result();
                    String statusNow = "";
                    String statusFinal = "";
                    ResultSet rs = asyncResult.result();
                    List<JsonArray> data = rs.getResults();
                    String str = data.get(0).getString(6);
                    JsonObject workflow = new JsonObject(str);
                    JsonArray node = workflow.getJsonObject("填写表单").getJsonArray("data");
                    for(int i = 0; i < node.size(); ++ i) {
                        JsonObject wfCondition = node.getJsonObject(i);
                        JsonObject jsonValue = new JsonObject(dataSet);
                        JsonArray keywords = wfCondition.getJsonArray("keywords");
                        JsonArray rules = wfCondition.getJsonArray("rule");
                        JsonArray values = wfCondition.getJsonArray("value");
                        int flag = 0;
                        for (int j = 0; j < keywords.size(); ++ j, ++ flag) {
                            String keyword = keywords.getString(j);
                            if(keyword.equals("默认")) {
                                statusNow = wfCondition.getString("nextNode");
                                if(!statusNow.equals("")) {
                                    statusFinal = "审批中";
                                }else {
                                    statusFinal = "审批完";
                                }

                                JsonArray dealer = workflow.getJsonObject(statusNow).getJsonArray("dealer");

                                String updateDataSQL = "update form_data set data_set = ?, status_now=  ?, status_final= ?, time_stamp = ?, dealer = ? where id = ?";
                                JsonArray updateDataParam = new JsonArray()
                                        .add(dataSet)
                                        .add(statusNow)
                                        .add(statusFinal)
                                        .add(timeStamp)
                                        .add(dealer.toString())
                                        .add(dataId);

                                connection.updateWithParams(updateDataSQL, updateDataParam, result -> {
                                    if(result.succeeded()) {
                                        jsonObject.clear().put("status", 200);
                                        routingContext.response().setStatusCode(200).end(Json.encodePrettily(jsonObject));
                                        connection.close();
                                    } else {
                                        jsonObject.clear().put("status", 500);
                                        routingContext.response().setStatusCode(500).end(Json.encodePrettily(jsonObject));
                                        connection.close();
                                    }
                                });
                                return;
                            } else {
                                String value = values.getString(j);
                                String rule = rules.getString(j);
                                if(rule.equals("等于")) {
                                    String userValue = dataSetJson.getJsonArray(keyword).getString(0);
                                    if(value.equals(userValue)) {
                                        continue;
                                    }else {
                                        break;
                                    }
                                }else if(rule.equals("早于") || rule.equals("小于")) {
                                    String userValue = dataSetJson.getJsonArray(keyword).getString(0);
                                    if(ConvertTool.toInt(value) > ConvertTool.toInt(userValue)) {
                                        continue;
                                    }else {
                                        break;
                                    }
                                } else if(rule.equals("晚于") || rule.equals("大于")) {
                                    String userValue = dataSetJson.getJsonArray(keyword).getString(0);
                                    if(ConvertTool.toInt(value) < ConvertTool.toInt(userValue)) {
                                        continue;
                                    } else {
                                        break;
                                    }
                                } else if(rule.equals("包含") || rule.equals("不包含")) {
                                    String userValue = dataSetJson.getJsonArray(keyword).getString(0);
                                    if(userValue.indexOf(value) >= 0) {
                                        continue;
                                    } else {
                                        break;
                                    }
                                }
                            }
                        }

                        if(flag == keywords.size()) {
                            statusNow = wfCondition.getString("nextNode");
                            JsonArray dealer = workflow.getJsonObject(statusNow).getJsonArray("dealer");
                            if(!statusNow.equals("")) {
                                statusFinal = "审批中";
                            }else {
                                statusFinal = "审批完";
                            }
                            String updateDataSQL = "update form_data set data_set = ?, status_now=  ?, status_final= ?, time_stamp = ?, dealer = ? where id = ?";
                            JsonArray updateDataParam = new JsonArray()
                                    .add(dataSet)
                                    .add(statusNow)
                                    .add(statusFinal)
                                    .add(timeStamp)
                                    .add(dealer.toString())
                                    .add(dataId);

                            connection.updateWithParams(updateDataSQL, updateDataParam, result -> {
                                if(result.succeeded()) {
                                    jsonObject.clear().put("status", 200);
                                    routingContext.response().setStatusCode(200).end(Json.encodePrettily(jsonObject));
                                    connection.close();
                                } else {
                                    jsonObject.clear().put("status", 500);
                                    routingContext.response().setStatusCode(500).end(Json.encodePrettily(jsonObject));
                                    connection.close();
                                }
                            });
                        }
                    }
                } else {
                    asyncResult.cause().printStackTrace();
                    jsonObject.put("status", 500);
                    jsonObject.put("message", "数据库操作异常");
                    routingContext.response().setStatusCode(500).end(Json.encodePrettily(jsonObject));
                }
                connfuture.result().close();
            });

            connfuture.setHandler(asyncResult -> {
                if(asyncResult.succeeded()) {
                    asyncResult.result().queryWithParams(queryTemplate, queryParam, queryStatusFuture);
                } else {
                    asyncResult.cause().printStackTrace();
                }
            });
        }
    }
}
