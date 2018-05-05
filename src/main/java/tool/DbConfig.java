package tool;

import java.util.Properties;

public class DbConfig {
    private Properties properties;
    private static String JDBC_DRIVER = "jdbc.driver";
    private static String JDBC_URL = "jdbc.url";
    private static String JDBC_USERNAME = "jdbc.username";
    private static String JDBC_PASSWORD = "jdbc.password";
    private static String DBCP_MAXTOTAL = "dbcp.maxTotal";
    private static String DBCP_MAXIDEL = "dbcp.maxIdle";

    public DbConfig(String configFile) {
        this.properties = PropertiesTool.loadFile(configFile);
    }

    public String getJdbcDriver() {
        return PropertiesTool.getString(this.properties, JDBC_DRIVER);
    }

    public String getJdbcUrl() {
        return PropertiesTool.getString(this.properties, JDBC_URL);
    }

    public String getJdbcUserName() {
        return PropertiesTool.getString(this.properties, JDBC_USERNAME);
    }

    public String getJdbcPassword() {
        return PropertiesTool.getString(this.properties, JDBC_PASSWORD);
    }

    public int getDbcpMaxTotal() {
        return ConvertTool.toInt(PropertiesTool.getString(this.properties, DBCP_MAXTOTAL, "8"));
    }

    public int getDbcpMaxIdle() {
        return ConvertTool.toInt(PropertiesTool.getString(this.properties, DBCP_MAXIDEL, "8"));
    }
}
