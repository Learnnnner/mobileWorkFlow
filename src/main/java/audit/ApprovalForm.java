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

import java.util.List;

public class ApprovalForm {
    public static void approve(RoutingContext routingContext, Vertx vertx) {
        Future<SQLConnection> connfuture = Future.future();

        JsonObject jsonObject = routingContext.getBodyAsJson();
        String dataId = ConvertTool.toString(jsonObject.getString("dataId"));

        JsonObject data = new JsonObject();

        if (!StringTool.isEmpty(dataId)) {
            DataAccess dataAccess = DataAccess.create(vertx);
            dataAccess.getJDBCClient().getConnection(connfuture);

            JsonArray params = new JsonArray();
            params.add(dataId);
            String QuerytemplateId = "SELECT templateId, dataSet, statusNow FROM v_user_template_data where dataId = ?";
            String wf = "SELECT wf_set FROM form_templates where id = ?";
            String updateSql = "Update form_data set status_now = ?, status_final = ?, dealer = ? where id = ?";

            Future<ResultSet> TempateIdFuture = Future.future();

            TempateIdFuture.setHandler(asyncResult -> {
                if(asyncResult.succeeded()) {
                    ResultSet rs = asyncResult.result();
                    List<JsonArray> idList = rs.getResults();
                    Long templateId = idList.get(0).getLong(0);
                    String dataSet = idList.get(0).getString(1);
                    final String status = idList.get(0).getString(2);
                    JsonArray templateParam = new JsonArray();
                    templateParam.add(templateId);
                    final SQLConnection connection = connfuture.result();
                    connection.queryWithParams(wf, templateParam, res -> {
                        if(res.succeeded()) {
                            String statusNow = "";
                            String statusFinal = "";
                            String dealer = "";
                            ResultSet wfSet = res.result();
                            List<JsonArray> list = wfSet.getResults();
                            String temp = list.get(0).getString(0);
                            JsonObject wfJson = new JsonObject(temp);
                            JsonArray node = wfJson.getJsonObject(status).getJsonArray("data");
                            JsonArray updateDataParam = new JsonArray();
                            if(node.size() <= 0) {
                                statusNow = "";
                                dealer = "";
                                statusFinal = "审批完";
                            }else {
                                for(int i = 0; i < node.size(); ++ i) {
                                    JsonObject wfCondition = node.getJsonObject(i);
                                    JsonObject dataSetJson = new JsonObject(dataSet);
                                    JsonArray keywords = wfCondition.getJsonArray("keywords");
                                    JsonArray rules = wfCondition.getJsonArray("rule");
                                    JsonArray values = wfCondition.getJsonArray("value");
                                    int flag = 0;

                                    for (int j = 0; j < keywords.size(); ++ j, ++ flag) {
                                        String keyword = keywords.getString(j);
                                        if(keyword.equals("默认")) {
                                            statusNow = wfCondition.getString("nextNode");
                                            dealer = "";
                                            if(statusNow != "") {
                                                dealer = wfJson.getJsonObject(statusNow).getJsonArray("dealer").toString();
                                            }
                                            if(!dealer.equals("")) {
                                                statusFinal = "审批中";
                                            }else {
                                                statusFinal = "审批完";
                                            }
                                        }else {
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
                                            }else if(rule.equals("晚于") || rule.equals("大于")) {
                                                String userValue = dataSetJson.getJsonArray(keyword).getString(0);
                                                if(ConvertTool.toInt(value) < ConvertTool.toInt(userValue)) {
                                                    continue;
                                                }else {
                                                    break;
                                                }
                                            }else if(rule.equals("包含") || rule.equals("不包含")) {
                                                String userValue = dataSetJson.getJsonArray(keyword).getString(0);
                                                if(userValue.indexOf(value) >= 0) {
                                                    continue;
                                                }else {
                                                    break;
                                                }
                                            }
                                        }
                                    }

                                    if(flag == keywords.size()) {
                                        statusNow = wfCondition.getString("nextNode");
                                        dealer = "";

                                        if(statusNow != "") {
                                            dealer = wfJson.getJsonObject(statusNow).getJsonArray("dealer").toString();
                                        }

                                        if(!dealer.equals("")) {
                                            statusFinal = "审批中";
                                        }else {
                                            statusFinal = "已审批";
                                        }
                                    }
                                }
                            }

                             updateDataParam.add(statusNow).add(statusFinal).add(dealer).add(dataId);
                            connection.updateWithParams(updateSql, updateDataParam, result -> {
                                if(result.succeeded()) {
                                    data.put("status", 200);
                                    data.put("message", "审核成功");
                                    routingContext.response().setStatusCode(200).end(Json.encodePrettily(data));
                                    connfuture.result().close();
                                }else {
                                    data.put("status", 500);
                                    data.put("message", "数据库操作异常");
                                    routingContext.response().setStatusCode(500).end(Json.encodePrettily(data));
                                    connfuture.result().close();
                                }
                            });
                        }else {
                            data.put("status", 500);
                            data.put("message", "数据库操作异常");
                            routingContext.response().setStatusCode(500).end(Json.encodePrettily(data));
                            connfuture.result().close();

                        }
                    });
                }else {
                    data.put("status", 500);
                    data.put("message", "数据库操作异常");
                    routingContext.response().setStatusCode(500).end(Json.encodePrettily(data));
                    connfuture.result().close();
                }
            });

            connfuture.setHandler(asyncResult -> {
                if(asyncResult.succeeded()) {
                    asyncResult.result().queryWithParams(QuerytemplateId, params, TempateIdFuture);
                } else {
                    asyncResult.cause().printStackTrace();
                }
            });
        }
    }
}
