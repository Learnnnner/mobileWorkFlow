package action;

import io.vertx.core.Vertx;
import io.vertx.ext.web.RoutingContext;
import io.vertx.ext.web.Session;

public class RedirectAuth {
    public static boolean redirectAuth(RoutingContext routingContext) {
        Session session = routingContext.session();
        String loginname = session.get("loginname");
        if(loginname == null) {
            return false;
        } else return true;
    }
}
