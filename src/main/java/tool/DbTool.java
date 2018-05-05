package tool;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

public class DbTool {
    private static final Logger LOGGER = LoggerFactory.getLogger(DbTool.class);
    private ThreadLocal<Connection> connectionHolder;
    private SingleDataSource dataSource;

    public DbTool(DbConfig dbConfig) {
        this.dataSource = new SingleDataSource(dbConfig);
        this.initDataSouce("");
    }

    private void initDataSouce(String db) {
        this.connectionHolder = new ThreadLocal();
    }

    public Connection getConnection() {
        Connection conn = (Connection)this.connectionHolder.get();
        if (conn != null) {
            return conn;
        } else {
            try {
                try {
                    conn = this.dataSource.getConnection();
                } catch (SQLException var6) {
                    LOGGER.error("获取数据库连接失败", var6);
//                    this.handleSqlError(var6);
                }
                return conn;
            } finally {
                ;
            }
        }
    }

    public <T> List<T> queryObjectList(T obj) {
        return this.queryObjectList(obj);
    }

    public <T> T queryObject(T obj) {
        List<T> objList = this.queryObjectList(obj);
        if (objList != null && objList.size() != 0) {
            if (objList.size() > 1) {
                LOGGER.error("查询结果不唯一");
                throw new RuntimeException("查询结果不唯一，请检查查询条件");
            } else {
                return objList.size() == 1 ? objList.get(0) : null;
            }
        } else {
            return null;
        }
    }
}
