* status
```
curl -i http://localhost:8080/status
or
curl -i https://mysnowflake-bartonhammond.rhcloud.com/status
```

* env
```
curl -i http://localhost:8080/env
or
curl -i https://mysnowflake-bartonhammond.rhcloud.com/env
```

* create account
```
curl --data "username=barton&password=password&email=foo@gmail.com" http://localhost:8080/account/register
or
 curl --data "username=barton&password=password&email=foo@gmail.com" https://mysnowflake-bartonhammond.rhcloud.com/account/register

```

* login
```
curl --data "username=barton&password=password" http://localhost:3000/account/login
or
curl --data "username=barton&password=password" https://mysnowflake-bartonhammond.rhcloud.com/account/login
```

* restricted
```
curl -v -H "Authorization: Bearer
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImJhcnRvbiIsImVtYWlsIjoiYmFydG9uQGFjY2xpdnl4LmNvbSIsImlhdCI6MTQ1MTMyNjMyMn0.TXIKx4fnItkhAtEYd5NQhSRr3jQcykOFniJ1QnNO30Q"
http://localhost:3000/restricted
or

curl -v -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImJhcnRvbiIsImVtYWlsIjoiYmFydG9uQGFjY2xpdnl4LmNvbSIsImlhdCI6MTQ1MTM0NTQ5MH0.8EVW5EkIKcT3-P7ZZFadC3KEZcA4oypLyt5WGT-BnUo" https://mysnowflake-bartonhammond.rhcloud.com/restricted

```



