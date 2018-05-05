package pojo;

import io.vertx.core.json.JsonObject;

public class User {
    private long id;
    private String username;
    private String password;
    private String realname;

    public User() {}

    public User(Long id, String realname,String username, String password) {
        this.id = id;
        this.realname = realname;
        this.username = username;
        this.password = password;
    }

    public User(JsonObject json) {
        this.id = json.getLong("id");
        this.realname = json.getString("realname");
        this.username = json.getString("username");
        this.password = json.getString("password");
    }

    public JsonObject toJson() {
        JsonObject json = new JsonObject()
                .put("id", id)
                .put("realname", realname)
                .put("username", username)
                .put("password", password);
        return json;
    }

    public long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public String getRealname() {
        return realname;
    }

    public void setId(long id) {
        this.id = id;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setRealname(String realname) {
        this.realname = realname;
    }
}
