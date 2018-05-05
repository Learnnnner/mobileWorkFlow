package database;

import io.vertx.core.Vertx;
import io.vertx.ext.jdbc.JDBCClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DatabaseServiceImpl implements DatabaseService{
    private static final Logger LOGGER = LoggerFactory.getLogger(DatabaseServiceImpl.class);

    private final JDBCClient dbClient;

    DatabaseServiceImpl(JDBCClient dbClient, Vertx vertx) {
        this.dbClient = dbClient;
    }
}
