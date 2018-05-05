import http.HttpServerVerticle;
import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;

public class MainVerticle extends AbstractVerticle {

    @Override
    public void start(Future<Void> startFuture) throws Exception {
        Future<String> httpVerticleDeployment = Future.future();
        vertx.deployVerticle(new HttpServerVerticle(), httpVerticleDeployment);

        httpVerticleDeployment.setHandler((res) -> {
            if (res.succeeded()) {
                System.out.println("http success");
                startFuture.complete();
            } else {
                System.out.println("http fail");
                startFuture.fail(res.cause());
            }
        });
    }
}
