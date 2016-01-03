Snowflake Server ![Snowflake Server](https://cloud.githubusercontent.com/assets/1282364/12075658/12d1cfee-b14c-11e5-9aa5-dc7fd1f0c795.png)
==================================
### This is a nodejs server for the [React-Native app Snowflake](https://github.com/bartonhammond/snowflake). 

* This nodejs server runs locally and on OpenShift scaling for web traffic.
* It uses:
  * **Hapi** [http://hapijs.com/](http://hapijs.com/) - A rich
  framework for building applications and services
  * **JMeter** -
    [http://jmeter.apache.org/]([http://jmeter.apache.org/) - The Apache JMeter™ application is open source software, a 100% pure Java application designed to load test functional behavior and measure performance
  * **MongoDb** [https://www.mongodb.org](https://www.mongodb.org) - MongoDBis an open-source, document database designed for ease of
  development and scaling.
  * **NodeMailer** [http://nodemailer.com/](http://nodemailer.com/) - Send e-mails with Node.JS – easy as cake!
  * **OpenShift**
    [https://www.openshift.com/](https://www.openshift.com/) - OpenShift Online is Red Hat's next-generation application hosting platform that makes it easy to run your web applications in the cloud for free.
  * **Redis** - [http://redis.io/](http://redis.io/) - Redis is an open source, in-memory data structure store, used as database, cache and message broker.
  * **Swagger** - [http://swagger.io/](http://swagger.io/) - The World's Most Popular Framework for APIs.
  * **Jason Web Token** -
    [https://github.com/auth0/node-jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
    JSON Web Tokens are an open, industry standard RFC 7519 method for representing claims securely between two parties.


[![Join the chat at https://gitter.im/bartonhammond/snowflake](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/bartonhammond/snowflake?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat)](https://github.com/bartonhammond/snowflake/blob/master/LICENSE)

# Content
- [Use case](#usecase)
- [Summary](#summary)
- [Setup](#setup)
- [API Documentation](http://mysnowflake-bartonhammond.rhcloud.com/documentation)
- [Source documentation](http://bartonhammond.github.io/snowflake-hapi-openshift/server.js.html)

## Usecase

* **Register** - When user registers w/ email, username, password, the
  system sends a email verification.  Until the user clicks the link
  within the email, their Email Verified field is false.  When
  clicked, the field is set to true. The response from Register
  contains a "Session Token" for subsequent authentication.

* **Login** When the user logs in with their username and password,
the sytem responds with a "Session Token".

* **Log Out** When the user logs out, the Session Token is blacklisted
  using Redis.  Every entry point to the server that requires
  authentication first checks if the Session Toke has already been
  revoked by checking it's presence in Redis.  If present, the request
  is denied.

* **Reset Password** Once the user provides an Email address, they
  receive an email with a link that takes them to a form to submit a
  new password

* **Profile** Once a user is logged in, they can view their profile.

* **Profile Update** A User can  modify their username and/or email.
  If the email address is modified, their Email Verified value is
  set again to false and a new
  email is sent to the new address for verification.
  

## Summary

### Hapi
The nodeJS server uses Hapi.  Hapi was developed and Open Sourced by
[Walmart Labs](http://www.walmartlabs.com/project_type/open-source/).
It has been battle tested by Walmart, the largest retailer on earth.
I chose it over Express 'cause Hapi is more targeted to API support
and it looked interesting.

### OpenShift
OpenShift supports a free NodeJS setup that will scale with web
traffic.  This **Snowflake Server** setup will use MongoDB and Redis.

### MongoDb
Mongodb will host our documents, namely User information, at this
time.  We'll be using **Mongoose** for interacting with Mongo within
our code.

### Redis
Redis is fantastic for key,value pair access.  We're using it here for
"Black Listing Json Web Tokens".  You can read about this concept here [https://auth0.com/blog/2015/03/10/blacklist-json-web-token-api-keys/](https://auth0.com/blog/2015/03/10/blacklist-json-web-token-api-keys/)

### Swagger
Swagger provides the api documentation - simply augmenting the
endpoints generates a page showing all the API access points.

### Jason Web Token
JWT is used in the Authentication as a Session Token.


## Setup

### Locally (one time only setup)
----------------------------------------------------------
* Install Mongo db [https://www.mongodb.org/downloads#production](https://www.mongodb.org/downloads#production)

* Install Redis

  * I used Redis 2.18.24,
  * down load and unzip [http://download.redis.io/releases/redis-2.8.24.tar.gz](http://download.redis.io/releases/redis-2.8.24.tar.gz)

```
cd redis-2.8.24
make
cd src/
./redis-server 
```

  * Then in different terminal,

```
npm start
```

### OpenShift
----------------------------------------------------------

* Create an account at http://openshift.redhat.com/

* Install the command line tool ```rhc```

* Create a namespace, if you haven't already do so

```
rhc domain create <yournamespace>
```

* Create a nodejs application - this nodejs, mongodb, rockmongo and redis

  * notice the ```-s``` at the end - that enables Scaling to Web Traffic!

```
rhc app-create mysnowflake  nodejs-0.10 mongodb-2.4 -s

rhc add-cartridge \
http://cartreflect-claytondev.rhcloud.com/reflect?github=transformatordesign/openshift-redis-cart \
-a mysnowflake
```

* Add this repository
```
cd mysnowflake
git remote add upstream -m master git://github.com/bartonhammond/snowflake-hapi-openshift.git
git pull -s recursive -X theirs upstream master
```

* Copy config.sample.js to config.js and provide values

```
cp src/config.sample.js src/config.js
```

* Then push the repo to OpenShift

```
git push
```
    
* That's it, you can now checkout your application at:[ http://mysnowflake-$yournamespace.rhcloud.com](http://mysnowflake-$yournamespace.rhcloud.com/)

* There are numerous ```curl``` command in ```curl.md```

* If you want to have this project also in your GitHub account follow
these steps but be WARNED: unless you use a "Private" repository, your
```config.js``` will be visible.

  * https://forums.openshift.com/how-to-keep-a-github-repository-and-an-openshift-repository-in-sync
