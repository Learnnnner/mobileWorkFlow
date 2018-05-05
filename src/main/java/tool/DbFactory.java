package tool;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class DbFactory {
    private static volatile DbFactory instance;
    private Map<String, DbTool> dbToolMap = new ConcurrentHashMap<>();

    private DbFactory() {
    }

    public static DbFactory getInstance() {
        if (instance == null) {
            Class var0 = DbFactory.class;
            synchronized(DbFactory.class) {
                if (instance == null) {
                    instance = new DbFactory();
                }
            }
        }

        return instance;
    }

    public DbTool getDbTool(String dbConfigFile) {
        if (this.dbToolMap.containsKey(dbConfigFile)) {
            return (DbTool)this.dbToolMap.get(dbConfigFile);
        } else {
            DbConfig dbConfig = new DbConfig(dbConfigFile);
            DbTool dbTool = new DbTool(dbConfig);
            this.dbToolMap.put(dbConfigFile, dbTool);
            return dbTool;
        }
    }

    public DbTool getDbTool() {
        return this.getDbTool("config.properties");
    }
}
