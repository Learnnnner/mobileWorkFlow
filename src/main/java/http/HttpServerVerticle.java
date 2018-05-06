package http;

import action.Login;
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
import io.vertx.ext.web.sstore.SessionStore;

public class HttpServerVerticle extends AbstractVerticle {
    public static final String CONFIG_HTTP_SERVER_PORT = "http.server.port";

    @Override
    public void start(Future<Void> startFuture) throws Exception {
        HttpServer server = vertx.createHttpServer();
        Router router = Router.router(vertx);


        router.route().handler(BodyHandler.create());
        router.route().handler(CorsHandler.create("*").allowedMethod(HttpMethod.POST));
        router.route(HttpMethod.POST,"/login").handler(this::loginHandler);
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

    private void indexHandler(RoutingContext routingContext) {
        HttpServerResponse response = routingContext.response();
        String filePath = "webroot/login.html";
        response.sendFile(filePath);
    }

    private void loginHandler(RoutingContext routingContext) {
        Login login = new Login(routingContext, vertx);
    }

    private void pageHandler(RoutingContext routingContext) {
        HttpServerResponse response = routingContext.response();
        String file = routingContext.request().getParam("page");
        String filePath = "webroot/" + file + ".html";
        response.sendFile(filePath);
    }

    private void fileHandler(RoutingContext routingContext) {
        HttpServerResponse response = routingContext.response();
        String fileType = routingContext.request().getParam("fileType");
        String file = routingContext.request().getParam("file");
        String filePath = "webroot/" + fileType + "/" + file;
        response.sendFile(filePath);
    }
}
