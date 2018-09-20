package database;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.jdbc.JDBCClient;
import io.vertx.ext.sql.SQLConnection;

public class DatabaseVerticle extends AbstractVerticle {

    private static SQLConnection connection;

    @Override
    public void start(Future<Void> startFuture) throws Exception {
        JDBCClient dbClient = JDBCClient.createShared(vertx, new JsonObject()
                .put("url", "jdbc:mysql://localhost:3306/mwf")
                .put("driver_class", "com.mysql.jdbc.Driver")
                .put("max_pool_size", 300)
                .put("user", "root")
                .put("password", "h87210019"));

        if(connection == null) {
            dbClient.getConnection(ar -> {
                if (ar.failed()) {
                    startFuture.fail(ar.cause());
                } else {
                    connection = ar.result();
                }
            });
        }
    }

    public void CheckUser(JsonObject jsonObject) {}
}
