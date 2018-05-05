package tool;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.FileFilter;
import java.net.JarURLConnection;
import java.net.URL;
import java.util.Enumeration;
import java.util.HashSet;
import java.util.Set;
import java.util.jar.JarEntry;
import java.util.jar.JarFile;

public class ClassTool {
    private static final Logger LOGGER = LoggerFactory.getLogger(ClassTool.class);

    public ClassTool() {}

    public static ClassLoader getClassLoader() {
        return Thread.currentThread().getContextClassLoader();
    }

    public static Class<?> loadClass(String className, boolean isInitialized) {
        try {
            Class<?> cls = Class.forName(className, isInitialized, getClassLoader());
            return cls;
        } catch (ClassNotFoundException var4) {
            LOGGER.error("加载类失败", var4);
            throw new RuntimeException(var4);
        }
    }

    public static Class<?> loadClass(String className) {
        return loadClass(className, true);
    }

    public static Set<Class<?>> getClassSet(String packageName) {
        HashSet classSet = new HashSet();

        try {
            Enumeration urls = getClassLoader().getResources(packageName.replace(".", "/"));

            while(true) {
                while(true) {
                    URL url;
                    do {
                        if (!urls.hasMoreElements()) {
                            return classSet;
                        }

                        url = (URL)urls.nextElement();
                    } while(url == null);

                    String protocol = url.getProtocol();
                    if (protocol.equals("file")) {
                        String packagePath = url.getPath().replaceAll("%20", " ");
                        addClass(classSet, packagePath, packageName);
                    } else if (protocol.equals("jar")) {
                        JarURLConnection jarURLConnection = (JarURLConnection)url.openConnection();
                        if (jarURLConnection != null) {
                            JarFile jarFile = jarURLConnection.getJarFile();
                            if (jarFile != null) {
                                Enumeration jarEntries = jarFile.entries();

                                while(jarEntries.hasMoreElements()) {
                                    JarEntry jarEntry = (JarEntry)jarEntries.nextElement();
                                    String jarEntryName = jarEntry.getName();
                                    if (jarEntryName.endsWith(".class")) {
                                        String className = jarEntryName.substring(0, jarEntryName.lastIndexOf(".")).replaceAll("/", ".");
                                        doAddClass(classSet, className);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } catch (Exception var11) {
            LOGGER.error("获取集合类失败", var11);
            throw new RuntimeException(var11);
        }
    }

    private static void addClass(Set<Class<?>> classSet, String packagePath, String packageName) {
        File[] files = (new File(packagePath)).listFiles(new FileFilter() {
            public boolean accept(File file) {
                return file.isFile() && file.getName().endsWith(".class") || file.isDirectory();
            }
        });
        File[] var4 = files;
        int var5 = files.length;

        for(int var6 = 0; var6 < var5; ++var6) {
            File file = var4[var6];
            String fileName = file.getName();
            String subPackagePath;
            if (file.isFile()) {
                subPackagePath = fileName.substring(0, fileName.lastIndexOf("."));
                if (StringTool.isNotEmpty(packageName)) {
                    subPackagePath = packageName + "." + subPackagePath;
                }

                doAddClass(classSet, subPackagePath);
            } else {
                subPackagePath = fileName;
                if (StringTool.isNotEmpty(packagePath)) {
                    subPackagePath = packagePath + "/" + fileName;
                }

                String subPackageName = fileName;
                if (StringTool.isNotEmpty(packageName)) {
                    subPackageName = packageName + "." + fileName;
                }

                addClass(classSet, subPackagePath, subPackageName);
            }
        }

    }

    private static void doAddClass(Set<Class<?>> classSet, String className) {
        Class<?> cls = loadClass(className, false);
        classSet.add(cls);
    }
}
