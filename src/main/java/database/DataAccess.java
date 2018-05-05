package database;

import io.vertx.core.Vertx;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.jdbc.JDBCClient;

public class DataAccess {
    private static DataAccess dataAccess;
    private static JDBCClient jdbcClient;
    private static JsonObject config;

    static {
        config = new JsonObject()
                .put("url", "jdbc:mysql://localhost:3306/mwf")
                .put("driver_class", "com.mysql.jdbc.Driver")
                .put("max_pool_size", 30)
                .put("user", "root")
                .put("password", "h87210019");
    }

    public static DataAccess create(Vertx vertx) {
        if (dataAccess == null) {
            synchronized (DataAccess.class) {
                if (dataAccess == null) {
                    dataAccess = new DataAccess();
                    dataAccess.init(vertx);
                }
            }
        }
        return dataAccess;
    }

    private void init(Vertx vertx) {
        jdbcClient = JDBCClient.createShared(vertx, config);
    }

    public JDBCClient getJDBCClient() {
        return jdbcClient;
    }
}
