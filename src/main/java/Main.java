import http.HttpServerVerticle;
import io.vertx.core.DeploymentOptions;
import io.vertx.core.Vertx;

public class Main {
    public static void main(String[] args){
        Vertx vertx = Vertx.vertx();
//        vertx.deployVerticle(MainVerticle.class.getName());
        vertx.deployVerticle(HttpServerVerticle.class.getName(), new DeploymentOptions()
                .setInstances(2 * Runtime.getRuntime().availableProcessors()));
        System.out.println(2 * Runtime.getRuntime().availableProcessors());
    }

}
