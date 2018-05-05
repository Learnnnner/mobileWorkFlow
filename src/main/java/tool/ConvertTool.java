package tool;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ConvertTool {
    private static final Logger LOGGER = LoggerFactory.getLogger(ConvertTool.class);

    public ConvertTool() {
    }

    public static String toString(Object obj) {
        return toString(obj, "");
    }

    public static String toString(Object obj, String defaultValue) {
        return obj != null ? String.valueOf(obj) : defaultValue;
    }

    public static double toDouble(Object obj) {
        return toDouble(obj, 0.0D);
    }

    public static double toDouble(Object obj, double defaultValue) {
        if (obj == null) {
            return defaultValue;
        } else {
            String strValue = StringTool.trim(toString(obj));
            if (StringTool.isEmpty(strValue)) {
                return defaultValue;
            } else {
                double doubleValue = defaultValue;

                try {
                    doubleValue = Double.parseDouble(strValue);
                } catch (Exception var7) {
                    LOGGER.error("转换为双精度型失败", var7);
                    var7.printStackTrace();
                }

                return doubleValue;
            }
        }
    }

    public static float toFloat(Object obj) {
        return toFloat(obj, 0.0F);
    }

    public static float toFloat(Object obj, float defaultValue) {
        if (obj == null) {
            return defaultValue;
        } else {
            String strValue = StringTool.trim(toString(obj));
            if (StringTool.isEmpty(strValue)) {
                return defaultValue;
            } else {
                float floatValue = defaultValue;

                try {
                    floatValue = Float.parseFloat(strValue);
                } catch (Exception var5) {
                    LOGGER.error("转换为浮点数失败", var5);
                    var5.printStackTrace();
                }

                return floatValue;
            }
        }
    }

    public static long toLong(Object obj) {
        return toLong(obj, 0);
    }

    public static long toLong(Object obj, int defaultValue) {
        if (obj == null) {
            return (long)defaultValue;
        } else {
            String strValue = StringTool.trim(toString(obj));
            if (StringTool.isEmpty(strValue)) {
                return (long)defaultValue;
            } else {
                long longValue = (long)defaultValue;

                try {
                    longValue = Long.parseLong(strValue);
                } catch (Exception var6) {
                    LOGGER.error("转换为长整型失败", var6);
                    var6.printStackTrace();
                }

                return longValue;
            }
        }
    }

    public static long[] toLong(Object[] objList) {
        if (objList == null) {
            return null;
        } else {
            long[] longList = new long[objList.length];

            for(int i = 0; i < objList.length; ++i) {
                longList[i] = toLong(objList[i]);
            }

            return longList;
        }
    }

    public static int toInt(Object obj) {
        return toInt(obj, 0);
    }

    public static int toInt(Object obj, int defaultValue) {
        if (obj == null) {
            return defaultValue;
        } else {
            String strValue = StringTool.trim(toString(obj));
            if (StringTool.isEmpty(strValue)) {
                return defaultValue;
            } else {
                int intValue = defaultValue;

                try {
                    intValue = Integer.parseInt(strValue);
                } catch (Exception var5) {
                    LOGGER.error("转换为整型失败", var5);
                    var5.printStackTrace();
                }

                return intValue;
            }
        }
    }

    public static boolean toBoolean(Object obj) {
        return toBoolean(obj, false);
    }

    public static boolean toBoolean(Object obj, boolean defaultValue) {
        if (obj == null) {
            return defaultValue;
        } else {
            String strValue = StringTool.trim(toString(obj));
            if (StringTool.isEmpty(strValue)) {
                return defaultValue;
            } else {
                boolean boolValue = defaultValue;

                try {
                    boolValue = Boolean.parseBoolean(strValue);
                } catch (Exception var5) {
                    LOGGER.error("转换为整型失败", var5);
                    var5.printStackTrace();
                }

                return boolValue;
            }
        }
    }
}
