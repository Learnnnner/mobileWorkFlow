package http;

import action.Login;
import action.RedirectAuth;
import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;
import io.vertx.core.http.HttpMethod;
import io.vertx.core.http.HttpServer;
import io.vertx.core.http.HttpServerResponse;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;
import io.vertx.ext.web.handler.BodyHandler;
import io.vertx.ext.web.handler.CookieHandler;
import io.vertx.ext.web.handler.CorsHandler;
import io.vertx.ext.web.handler.SessionHandler;
import io.vertx.ext.web.sstore.LocalSessionStore;
import org.org.AddOrg;
import org.org.DeleteOrg;
import org.org.EditOrg;
import org.org.QueryOrg;
import org.user.AddUser;
import org.user.DeleteUser;
import org.user.QueryUser;
import workflow.template.QueryTemplate;
import workflow.workflow.AddWorkflow;
import workflow.workflow.QueryTable;
import workflow.workflow.QueryWorkflow;


public class HttpServerVerticle extends AbstractVerticle {
    public static final String CONFIG_HTTP_SERVER_PORT = "http.server.port";

    @Override
    public void start(Future<Void> startFuture) throws Exception {
        HttpServer server = vertx.createHttpServer();
        Router router = Router.router(vertx);

        router.route().handler(BodyHandler.create());
        router.route().handler(CookieHandler.create());
        router.route().handler(SessionHandler.create(LocalSessionStore.create(vertx)));

        router.route().handler(CorsHandler.create("*").allowedMethod(HttpMethod.POST));
        router.route(HttpMethod.POST,"/login").handler(this::loginHandler);
        router.route("/function").handler(this::functionHandler);
        router.route("/edit").handler(this::editHandler);
        router.route("/myform").handler(this::myformHandler);
        router.route("/staffManage").handler(this::staffManageHandler);

        router.route("/fetchOrgUser").handler(this::fetchOrgUser);
        router.route("/addOrgUser").handler(this::addOrgUser);
        router.route("/deleteOrgUser").handler(this::deleteOrgUser);
        router.route("/fillForm").handler(this::fillFormHandler);

        router.route("/org").handler(this::orgHandler);
        router.route("/fetchOrgs").handler(this::fetchOrgs);
        router.route("/deleteOrg").handler(this::deleteOrg);
        router.route("/addOrg").handler(this::addOrg);
        router.route("/editOrg").handler(this::editOrg);

        router.route("/fetchTemplate").handler(this::fetchTemplate);
        router.route("/table").handler(this::table);
        router.route("/fetchTable").handler(this::fetchTable);
        router.route("/fetchwf").handler(this::fetchwf);
        router.route("/savewf").handler(this::savewf);

        router.route("/editOrg").handler(this::editOrg);
        router.route("/:fileType/:file").handler(this::fileHandler);
        router.route("/*").handler(this::indexHandler);

        int portNumber = config().getInteger(CONFIG_HTTP_SERVER_PORT, 8080);
        server
                .requestHandler(router::accept)
                .listen(portNumber, ar -> {
                    if (ar.succeeded()) {
                        startFuture.complete();
                    } else {
                        startFuture.fail(ar.cause());
                    }
                });
    }

    private void table(RoutingContext routingContext) {
        HttpServerResponse response = routingContext.response();
        String filePath = "webroot/table.html";
        response.sendFile(filePath);
    }

    private void fetchTable(RoutingContext routingContext) {
        QueryTable.query(routingContext, vertx);
    }

    private void fetchTemplate(RoutingContext routingContext) {
        QueryTemplate.query(routingContext, vertx);
    }

    private void fetchwf(RoutingContext routingContext) {
        QueryWorkflow.query(routingContext, vertx);
    }

    private void savewf(RoutingContext routingContext) {
        AddWorkflow.add(routingContext, vertx);
    }

    private void deleteOrgUser(RoutingContext routingContext) {
        DeleteUser.delete(routingContext, vertx);
    }

    private void addOrgUser(RoutingContext routingContext) {
        AddUser.add(routingContext, vertx);
    }

    private void fetchOrgUser(RoutingContext routingContext) {
        QueryUser.query(routingContext, vertx);
    }

    private void editOrg(RoutingContext routingContext) {
        EditOrg.update(routingContext, vertx);
    }

    private void addOrg(RoutingContext routingContext) {
        AddOrg.add(routingContext, vertx);
    }

    private void deleteOrg(RoutingContext routingContext) {
        DeleteOrg.delete(routingContext, vertx);
    }

    private void orgHandler(RoutingContext routingContext) {
        HttpServerResponse response = routingContext.response();
        String filePath = "webroot/org.html";
        response.sendFile(filePath);
    }

    private void fetchOrgs(RoutingContext routingContext) {
        QueryOrg.query(routingContext, vertx);
    }

    private void fillFormHandler(RoutingContext routingContext) {
        HttpServerResponse response = routingContext.response();
        String filePath = "webroot/fillForm.html";
        response.sendFile(filePath);
    }

    private void staffManageHandler(RoutingContext routingContext) {
        HttpServerResponse response = routingContext.response();
        String filePath = "webroot/staffManage.html";
        response.sendFile(filePath);
    }

    private void myformHandler(RoutingContext routingContext) {
        HttpServerResponse response = routingContext.response();
        String filePath = "webroot/myform.html";
        response.sendFile(filePath);
    }

    private void editHandler(RoutingContext routingContext) {
        HttpServerResponse response = routingContext.response();
        String filePath = "webroot/edit.html";
        response.sendFile(filePath);
    }

    private void indexHandler(RoutingContext routingContext) {
        HttpServerResponse response = routingContext.response();
        String filePath = "webroot/login.html";
        response.sendFile(filePath);
    }

    private void loginHandler(RoutingContext routingContext) {
        Login login = new Login(routingContext, vertx);
    }

    private void functionHandler(RoutingContext routingContext) {
        HttpServerResponse response = routingContext.response();
        boolean flag = RedirectAuth.redirectAuth(routingContext);
        if(flag) {
            String filePath = "webroot/function.html";
            response.sendFile(filePath);
        }else {
            routingContext.reroute("/login.html");
        }
    }

    private void fileHandler(RoutingContext routingContext) {
        HttpServerResponse response = routingContext.response();
        String fileType = routingContext.request().getParam("fileType");
        String file = routingContext.request().getParam("file");
        String filePath = "webroot/" + fileType + "/" + file;
        response.sendFile(filePath);
    }
}
