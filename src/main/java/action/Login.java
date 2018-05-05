package action;

import io.vertx.core.Vertx;
import io.vertx.ext.web.RoutingContext;

public class Login {
    public Login(RoutingContext routingContext, Vertx vertx) {
        LoginService loginService = new LoginService();
        loginService.login(routingContext, vertx);
    }
}
