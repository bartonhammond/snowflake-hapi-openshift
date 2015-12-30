Snowflake ![snowflake](https://cloud.githubusercontent.com/assets/1282364/11599365/1a1c39d2-9a8c-11e5-8819-bc1e48b30525.png)
==================================
#### This is a nodejs server for the
[React-Native app Snowflake](https://github.com/bartonhammond/snowflake).
This server runs locally and on OpenShift.  It uses Hapi, MongoDb, Redis, and Jason Web Token.

[![Join the chat at https://gitter.im/bartonhammond/snowflake](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/bartonhammond/snowflake?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
![ios](https://img.shields.io/badge/IOS--blue.svg) [![Build Status](https://www.bitrise.io/app/348ae0a97c5e147a.svg?token=RmDwzjeIGuo7i9MeazE1fg)](https://www.bitrise.io/app/348ae0a97c5e147a)
![andriod](https://img.shields.io/badge/Android--blue.svg) [![Build Status](https://www.bitrise.io/app/1e0425744dcc7ce3.svg?token=uvZDZvo89BLXvjrArJJreQ)](https://www.bitrise.io/app/1e0425744dcc7ce3)
[![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat)](https://github.com/bartonhammond/snowflake/blob/master/LICENSE)

# Content

[Source documentation](http://bartonhammond.github.io/snowflake-hapi-openshift/server.js.html)

## Directions on usage

### Locally
----------------------------------------------------------
Install Mongo db and Redis and start them
I used Redis 2.18.24, downloaded the zip
[http://download.redis.io/releases/redis-2.8.24.tar.gz](http://download.redis.io/releases/redis-2.8.24.tar.gz)
and ```make```


### OpenShift
----------------------------------------------------------

* Create an account at http://openshift.redhat.com/

* Install the command line tool ```rhc```

* Create a namespace, if you haven't already do so

  ```  rhc domain create <yournamespace>```

* Create a nodejs application - this nodejs, mongodb, rockmongo and
  redis (2.8.13)

```
rhc app-create mysnowflake  nodejs-0.10 mongodb-2.4 rockmongo-1.1 \
http://cartreflect-claytondev.rhcloud.com/reflect?github=transformatordesign/openshift-redis-cart
  
  ```

* Add this repository
```
    cd mysnowflake
    git remote add upstream -m master git://github.com/bartonhammond/snowflake-hapi-openshift.git
    git pull -s recursive -X theirs upstream master
```

* Copy config.sample.js to config.js and provide values

```cp src/config.sample.js src/config.js```

* Then push the repo to OpenShift

```
git push
```
    
* That's it, you can now checkout your application at:[ http://mysnowflake-$yournamespace.rhcloud.com](http://mysnowflake-$yournamespace.rhcloud.com/)

* There are numerous ```curl``` command in ```curl.md```

* If you want to have this project also in your GitHub account follow
these steps

  * https://forums.openshift.com/how-to-keep-a-github-repository-and-an-openshift-repository-in-sync
