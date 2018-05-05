package database;

import io.vertx.core.AsyncResult;
import io.vertx.core.Handler;
import io.vertx.core.Vertx;
import io.vertx.ext.asyncsql.AsyncSQLClient;
import io.vertx.ext.jdbc.JDBCClient;

public interface DatabaseService {
    static DatabaseService create(JDBCClient dbClient, Handler<AsyncResult<DatabaseService>> readyHandler) {
        return new DatabaseServiceImpl(dbClient, Vertx.vertx());
    }
}
