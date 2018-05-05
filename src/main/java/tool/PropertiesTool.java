package tool;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class PropertiesTool {
    private static final Logger LOGGER = LoggerFactory.getLogger(PropertiesTool.class);

    public PropertiesTool() {
    }

    public static Properties loadFile(String fileName) {
        Properties props = null;
        InputStream is = null;

        try {
            is = ClassTool.getClassLoader().getResourceAsStream(fileName);
            if (is == null) {
                throw new FileNotFoundException(fileName + " 文件不存在");
            }

            props = new Properties();
            props.load(is);
        } catch (IOException var12) {
            LOGGER.error("读取属性文件失败", var12);
        } finally {
            if (is != null) {
                try {
                    is.close();
                } catch (IOException var11) {
                    LOGGER.error("关闭文件失败", var11);
                }
            }

        }

        return props;
    }

    public static String getString(Properties properties, String key) {
        return getString(properties, key, "");
    }

    public static String getString(Properties properties, String key, String defaultValue) {
        String value = defaultValue;
        if (properties.containsKey(key)) {
            value = properties.getProperty(key);
        }

        return value;
    }

    public static int getInt(Properties properties, String key) {
        return getInt(properties, key, 0);
    }

    public static int getInt(Properties properties, String key, int defaultValue) {
        int value = defaultValue;
        if (properties.containsKey(key)) {
            value = ConvertTool.toInt(properties.getProperty(key));
        }

        return value;
    }

    public static boolean getBoolean(Properties properties, String key) {
        return getBoolean(properties, key, false);
    }

    public static boolean getBoolean(Properties properties, String key, boolean defaultValue) {
        boolean value = defaultValue;
        if (properties.containsKey(key)) {
            value = ConvertTool.toBoolean(properties.getProperty(key));
        }

        return value;
    }
}
