package tool;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.SQLFeatureNotSupportedException;

public class SingleDataSource {
    private static final Logger LOGGER = LoggerFactory.getLogger(SingleDataSource.class);
    private DbConfig dbConfig;
    private String driverClass;

    public SingleDataSource(DbConfig dbConfig) {
        this.dbConfig = dbConfig;
        this.driverClass = dbConfig.getJdbcDriver();
    }

    private Connection createSingleConnection() {
        Connection conn = null;

        try {
            Class.forName(this.dbConfig.getJdbcDriver());
            conn = DriverManager.getConnection(this.dbConfig.getJdbcUrl(), this.dbConfig.getJdbcUserName(), this.dbConfig.getJdbcPassword());
            return conn;
        } catch (Exception var3) {
            throw new RuntimeException(var3);
        }
    }

    public Connection getConnection() throws SQLException {
        return this.createSingleConnection();
    }

    public Connection getConnection(String username, String password) throws SQLException {
        return null;
    }

    public PrintWriter getLogWriter() throws SQLException {
        return null;
    }

    public void setLogWriter(PrintWriter out) throws SQLException {
    }

    public void setLoginTimeout(int seconds) throws SQLException {
    }

    public int getLoginTimeout() throws SQLException {
        return 0;
    }

    public java.util.logging.Logger getParentLogger() throws SQLFeatureNotSupportedException {
        return null;
    }

    public <T> T unwrap(Class<T> iface) throws SQLException {
        return null;
    }

    public boolean isWrapperFor(Class<?> iface) throws SQLException {
        return false;
    }

    public String getDriverClass() {
        return this.driverClass;
    }
}
