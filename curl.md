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
curl --data "username=barton&password=password" http://localhost:8080/account/login
or
curl --data "username=barton&password=password" https://mysnowflake-bartonhammond.rhcloud.com/account/login
```

* logout
```
curl -v -H "Authorization: Bearer \
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImJhcnRvbiIsImVtYWlsIjoiYmFydG9uQGFjY2xpdnl4LmNvbSIsImlhdCI6MTQ1MTQyNTg0MywianRpIjoiand0aWQifQ.J2_fRJhD7Vo7Mfj_MFKXQyHhq5FnpYehvYwsrHCyneY" \
--data {} http://localhost:8080/account/logout

or

curl -v -H "Authorization: Bearer \
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImJhcnRvbiIsImVtYWlsIjoiYmFydG9uQGFjY2xpdnl4LmNvbSIsImlhdCI6MTQ1MTQyNjA2NywianRpIjoiand0aWQifQ.puxYnQu6RqAYgGzm-7xOVlqHcGpcdG7M6CyRvpQH6Hg" \
--data {} https://mysnowflake-bartonhammond.rhcloud.com/account/logout
```


* restricted
```
curl -v -H "Authorization: Bearer \
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImJhcnRvbiIsImVtYWlsIjoiYmFydG9uQGFjY2xpdnl4LmNvbSIsImlhdCI6MTQ1MTQyNDg3MSwianRpIjoiand0aWQifQ.VTFH8tlp2N_DkTd0B5tr-oaoBikNcDYL54HLo8qtv68" \
http://localhost:8080/restricted
or

curl -v -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImJhcnRvbiIsImVtYWlsIjoiYmFydG9uQGFjY2xpdnl4LmNvbSIsImlhdCI6MTQ1MTQyNjA2NywianRpIjoiand0aWQifQ.puxYnQu6RqAYgGzm-7xOVlqHcGpcdG7M6CyRvpQH6Hg" https://mysnowflake-bartonhammond.rhcloud.com/restricted

```

* reset password
```
curl --data "email=foo@gmail.com" http://localhost:8080/account/resetPasswordRequest
or
 curl --data "email=foo@gmail.com" https://mysnowflake-bartonhammond.rhcloud.com/account/resetPasswordRequest
```

* getMe - get the profile
```
curl -v -H "Authorization: Bearer \
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImJhcnRvbiIsImVtYWlsIjoiYmFydG9uQGFjY2xpdnl4LmNvbSIsImlhdCI6MTQ1MTQ0MTU2NywianRpIjoiand0aWQifQ.y5ovHgLhawYkr-ZdiDmADJdlhnL8kPMpqq0unfQfqpY" \
http://localhost:8080/account/me
or

curl -v -H "Authorization: Bearer \
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImJhcnRvbiIsImVtYWlsIjoiYmFydG9uQGFjY2xpdnl4LmNvbSIsImlhdCI6MTQ1MTQ0MTU2NywianRpIjoiand0aWQifQ.y5ovHgLhawYkr-ZdiDmADJdlhnL8kPMpqq0unfQfqpY" \
https://mysnowflake-bartonhammond.rhcloud.com/account/me

```
