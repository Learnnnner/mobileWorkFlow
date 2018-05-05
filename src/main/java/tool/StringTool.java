package tool;

import org.apache.commons.lang3.StringUtils;

import java.util.Random;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class StringTool extends StringUtils {
    private static final String RANDOM_STR = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final Random RANDOM = new Random();

    public StringTool() {}

    public static String[] toLowerCase(String[] strArr) {
        if (strArr.length == 0) {
            return strArr;
        } else {
            String[] strLower = new String[strArr.length];

            for(int i = 0; i < strArr.length; ++i) {
                strLower[i] = strArr[i].toLowerCase();
            }

            return strLower;
        }
    }

    public static String trimBegin(String str, String beginStr) {
        if (str.indexOf(beginStr) == 0) {
            str = str.substring(beginStr.length());
        }

        return str;
    }

    public static String trimEnd(String str, String endStr) {
        if (str.endsWith(endStr)) {
            str = str.substring(0, str.length() - endStr.length());
        }

        return str;
    }

    public static boolean isDouble(String str) {
        Pattern pattern = Pattern.compile("-?[0-9]+.?[0-9]+");
        Matcher isNum = pattern.matcher(str);
        return isNum.matches();
    }

    public static String randomStr(int size) {
        StringBuilder sb = new StringBuilder();

        for(int i = 0; i < size; ++i) {
            sb.append("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".charAt(RANDOM.nextInt("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".length())));
        }

        return sb.toString();
    }
}
