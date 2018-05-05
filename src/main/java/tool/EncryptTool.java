package tool;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.codec.binary.StringUtils;
import org.apache.commons.codec.digest.DigestUtils;

public class EncryptTool {
    public EncryptTool() {
    }

    public static String encodeSM4(String str) {
        return "";
    }

    public static String decodeSM4(String str) {
        return "";
    }

    public static String encodeMD5(String encodeStr) {
        return DigestUtils.md5Hex(encodeStr);
    }

    public static String encodeSHA1(String encodeStr) {
        return DigestUtils.sha1Hex(encodeStr);
    }

    public static byte[] encodeBase64(String encodeStr) {
        return Base64.encodeBase64(encodeStr.getBytes());
    }

    public static byte[] decodeBase64(String decodeStr) {
        return Base64.decodeBase64(decodeStr.getBytes());
    }

    public static String encodeBase64String(String encodeStr) {
        return Base64.encodeBase64String(encodeStr.getBytes());
    }

    public static String decodeBase64String(String encodeStr) {
        return StringUtils.newStringUtf8(encodeBase64(encodeStr));
    }
}
