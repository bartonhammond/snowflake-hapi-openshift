Snowflake Server ![Snowflake Server](https://cloud.githubusercontent.com/assets/1282364/12075658/12d1cfee-b14c-11e5-9aa5-dc7fd1f0c795.png)
==================================
### This is a Hapi server, backed by MongoDb & Redis, running *freely* on Openshift for the [React-Native mobile app Snowflake](https://github.com/bartonhammond/snowflake). 

####You can consider this a "starter server" or a "boilerplate" or maybe just an "example" of how these technologies work together. In any case, I hope there's something here you can learn and apply to your project!

| Services  | Javascript | noSQL |
| :------------:|:---------------:| :-----:|
| <img alt="OpenShift" src="https://cloud.githubusercontent.com/assets/1282364/12080283/a0c8c4cc-b21b-11e5-8a70-e62481fc9ea6.png" width="100px"/> | <img alt="hapi" src="https://cloud.githubusercontent.com/assets/1282364/12080288/b588af62-b21b-11e5-822c-bbb8506796eb.png" width="100px"> | <img alt="mongodb" src="https://cloud.githubusercontent.com/assets/1282364/12080294/e09dcd22-b21b-11e5-8a71-49c44f7d33d3.png" width="100px"/> |
| <img alt="jmeter" src="https://cloud.githubusercontent.com/assets/1282364/12080302/2f8719d4-b21c-11e5-9298-5b002bfd4134.png" width="100px"/>   | <img alt="swagger" src="https://cloud.githubusercontent.com/assets/1282364/12080584/e7cd2fda-b224-11e5-9ca4-6ecd236ce30f.png" width="100px"/>        | <img alt="redis" src="https://cloud.githubusercontent.com/assets/1282364/12080296/f130324c-b21b-11e5-8866-5a5adbdb5391.png" width="100px"/>|
| <img alt="blazeMeter" src="https://cloud.githubusercontent.com/assets/1282364/12080516/52df66c4-b222-11e5-99a0-454295f6eabb.png" width="100px"/>| <img alt="nodeMailer" src="https://cloud.githubusercontent.com/assets/1282364/12080598/457da8c6-b225-11e5-85a7-1710b9ae898e.png" width="100px"/>        |  <img alt="mongoose" src="https://cloud.githubusercontent.com/assets/1282364/12080621/b85fa1fa-b225-11e5-8c96-65029d50033d.png" width="100px"/> |


* **OpenShift** [https://www.openshift.com/](https://www.openshift.com/) - OpenShift Online is Red Hat's next-generation application hosting platform that makes it easy to run your web applications in the cloud for free.
* **Hapi** [http://hapijs.com/](http://hapijs.com/) - A rich framework for building applications and services
* **MongoDb** [https://www.mongodb.org](https://www.mongodb.org) - MongoDBis an open-source, document database designed for ease of development and scaling.
* **Mongoose** [http://mongoosejs.com/](http://mongoosejs.com/) - elegant mongodb object modeling for node.js
* **Redis** [http://redis.io/](http://redis.io/) - Redis is an open source, in-memory data structure store, used as database, cache and message broker.
* **Swagger** [http://swagger.io/](http://swagger.io/) - The World's Most Popular Framework for APIs.
* **Jason Web Token** [https://github.com/auth0/node-jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) JSON Web Tokens are an open, industry standard RFC 7519 method for representing claims securely between two parties.
* **NodeMailer** [http://nodemailer.com/](http://nodemailer.com/) - Send e-mails with Node.JS – easy as cake!
* **BlazeMeter** [https://blazemeter.com/](https://blazemeter.com/) -Run massively scalable, open source-based performance tests against all of your apps, from classic
web and mobile to microservices and APIs, and validate performance at every software delivery stage.
* **JMeter** [http://jmeter.apache.org/]([http://jmeter.apache.org/) - The Apache JMeter™ application is open source software, a 100% pure Java application designed to load test functional behavior and measure performance
   

[![Join the chat at https://gitter.im/bartonhammond/snowflake](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/bartonhammond/snowflake?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) [![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat)](https://github.com/bartonhammond/snowflake/blob/master/LICENSE)

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

### OpenShift
OpenShift supports a free NodeJS setup that will scale with web
traffic.  This **Snowflake Server** setup will use MongoDB and Redis.
![Open Shift Dashboard](https://cloud.githubusercontent.com/assets/1282364/12080387/4f44e074-b21e-11e5-97d0-244573cc7460.png)
* This server is using 3 small gears:
  * NodeJS (actually at version 4.2.3)
  * MongoDB
  * Redis
  * And a **Web Load Balancer**

Some commands that you'll want to know about, once you've install the
'rhc' client:

* rhc ssh -a mysnowflake

You can check the performance of your application using the link 

```
your-app-domain/haproxy-status/
```

The HAProxy Status Page
![HAProxy](https://cloud.githubusercontent.com/assets/1282364/12080273/4f1806c4-b21b-11e5-8293-065ee2ab8ea7.png)


### Hapi
The nodeJS server uses Hapi.  Hapi was developed and Open Sourced by
[Walmart Labs](http://www.walmartlabs.com/project_type/open-source/).
It has been battle tested by Walmart, the largest retailer on earth.
I chose it over Express 'cause Hapi is more targeted to API support
and it looked interesting.

This server is documented [here](http://bartonhammond.github.io/snowflake-hapi-openshift/server.js.html) in its entirety. 

Here's some flavor of what Hapi offers.  Below is the declarative definition of the ```/account/login``` end point.  The ```payload``` is validated here and shows how the ```username``` has a regex expression and is required.  The same for the ```email```.  The ```config``` option has the ```tags, description, notes``` that document how the ```api``` is used.  The ```handler``` is defined elsewhere.  Separating the end point validation and declaration from the implementation cleans up the code.

```
  {
    method: 'POST',
    path: '/account/login',
    handler: AccountHandlers.loginUser,
    config: {
      // Include this API in swagger documentation
      tags: ['api'],
      description: 'A user can login',
      notes: 'The user login will return a sessionToken',
      validate: {
	payload: {
          //username required with same regex as client          
	  username: Joi.string().regex(CONFIG.validation.username).required(),
          //password required with same regex as client
	  password: Joi.string().regex(CONFIG.validation.password).required()
	}
      }
    }
  },
```


### MongoDb
Mongodb will host our documents, namely User information, at this
time.  We'll be using **Mongoose** for interacting with Mongo within
our code.

Once you're ssh'd into Openshift via ```rhc ssh -a mysnowflake```, you
can use the ```mongo``` shell.


### Redis
Redis is fantastic for key,value pair access.  We're using it here for
"Black Listing Json Web Tokens".  You can read about this concept here [https://auth0.com/blog/2015/03/10/blacklist-json-web-token-api-keys/](https://auth0.com/blog/2015/03/10/blacklist-json-web-token-api-keys/)


### Swagger
Swagger provides the api documentation - simply augmenting the
endpoints generates a page showing all the API access points. 

Shown below is the generated API documentation - 

![Swagger docs](https://cloud.githubusercontent.com/assets/1282364/12080462/67b642e0-b220-11e5-905e-0238432e496b.png)

NOTE: you can test the APIs directly from the browser with the forms that Swagger provides!

![Swagger form](https://cloud.githubusercontent.com/assets/1282364/12080686/6d358390-b228-11e5-917e-23443bff39d6.png)

### Jason Web Token

JWT is used in the Authentication as a Session Token.  You can read the docs [here](http://bartonhammond.github.io/snowflake-hapi-openshift/src/auth/jwt-strategy.js.html) showing how it's setup.


### JMeter

Using JMeter allowed me to performance test the API.  I created a test suite with JMeter as shown below and debugged the script by running locally.  Once I was satisfied, I changed the ```HTTP Request Defaults``` and uploaded to BlazeMeter for testing.

Shown below is the script defined in JMeter

![JMeter setup](https://cloud.githubusercontent.com/assets/1282364/12080705/1b0c4ad0-b229-11e5-8690-08430d50b865.png)

### BlazeMeter
BlazeMeter was used to perform the tests as it is much better equipped to host the threads then my personal mac.


<a href="http://www.youtube.com/watch?feature=player_embedded&v=HKDw5po4TYM" target="_blank"><img src="https://i.ytimg.com/s_vi/HKDw5po4TYM/1.jpg?sqp=CKyjprQF&rs=AOn4CLDM4rBr05-tstNYVcwhO09V1WXdNA&time=1451856598959" 
alt="Running BlazeMeter" width="240" height="180" border="10" /></a>


The following screens show the results of running 50 concurrent users performing the following actions with a 1 second delay between each action:

* **register** - Register with username, password, and email
* **login** - Usename, password sued to login
* **restricted access** - access a page requiring SessionToken
* **profile/account/me** - show my profile
* **profile/account/{_id}** - update the profile defined by _id

**Original Test Configuration**
![Original Test Configuration](https://cloud.githubusercontent.com/assets/1282364/12080259/f004f1d8-b21a-11e5-8675-e81f4f915842.png)

**Overview**
![Overview](https://cloud.githubusercontent.com/assets/1282364/12080257/effc7008-b21a-11e5-981f-97c59494ff16.png)

**Timeline Report**
![Timeline Report](https://cloud.githubusercontent.com/assets/1282364/12080258/effeaddc-b21a-11e5-95c8-72e6d9960092.png)

**Load Report**
![Load Report](https://cloud.githubusercontent.com/assets/1282364/12080260/f004d7e8-b21a-11e5-8c42-1763e2c83945.png)

**Aggregate Report**
![Aggregate Report](https://cloud.githubusercontent.com/assets/1282364/12080261/f00705cc-b21a-11e5-8a33-c19a68c4abe1.png)

**Monitoring Report**
![Monitoring Report](https://cloud.githubusercontent.com/assets/1282364/12080262/f0071224-b21a-11e5-82f7-c1f2dd5bfd58.png)

-------------------


## Setup

Below are the instructions for setting up the server on your local machine.  These instructions work fine on the Mac - no promise is made for other OSs.  

* **Pre-setup step**: We are using **NodeMailer** and if you use a Gmail account, be sure to follow the steps below from [https://github.com/nodemailer/nodemailer](https://github.com/nodemailer/nodemailer)


> You may need to "Allow Less Secure Apps" in your gmail account (it's all the way at the bottom). You also may need to "Allow access to your Google account"



### Locally (one time only setup)
----------------------------------------------------------
* Install Mongo db
[https://www.mongodb.org/downloads#production](https://www.mongodb.org/downloads#production)
  * to start, ```sudo mongod```

* Install Redis

  * I used Redis 2.18.24, which is what's installed on OpenShift
  * down load and unzip [http://download.redis.io/releases/redis-2.8.24.tar.gz](http://download.redis.io/releases/redis-2.8.24.tar.gz)

```
cd redis-2.8.24
make
cd src/
./redis-server 
```

  * Then in different terminal, inside mysnowflake,

```
npm start
```


### OpenShift

Watch the following video to see all the steps to install the **Hapi nodes server to Openshift** in action:

<a href="http://www.youtube.com/watch?feature=player_embedded&v=Js4Kvd9gG6E" target="_blank"><img src="https://i.ytimg.com/s_vi/Js4Kvd9gG6E/2.jpg?sqp=CMzbprQF&rs=AOn4CLDZzm3zHrS-YdAJCi4a-yHXv73NyQ" 
alt="Snowflake Hot Loading" width="240" height="180" border="10" /></a>


----------------------------------------------------------

* Create an account at http://openshift.redhat.com/

* Install the command line tool ```rhc```

  * [https://developers.openshift.com/en/managing-client-tools.html](https://developers.openshift.com/en/managing-client-tools.html)

* Create a namespace, if you haven't already done so via the web interface

```
rhc domain create <yournamespace>
```

* Create a nodejs application with mongodb. The ```-s``` option is for "Scaling"

```
rhc app-create mysnowflake  nodejs-0.10 mongodb-2.4 -s

```

* Note that if you get an error during this step, most likely it has to do with copying the Openshift GIT repository to your local system.  What you can do is to your OpenShift account and use the link they provided for the **Source Code**.  Just ```git clone xxx``` where xxx is the link you copied from Openshift.


* This next command will load the Redis cartridge

```
rhc add-cartridge \
http://cartreflect-claytondev.rhcloud.com/reflect?github=transformatordesign/openshift-redis-cart \
-a mysnowflake
```


* These next few steps copy the SnowFlake server to your local Git repository from Openshift.

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
git push origin master
```
    
* **That's it!!!**

*  You can now checkout your application at:[ http://mysnowflake-$yournamespace.rhcloud.com](http://mysnowflake-$yournamespace.rhcloud.com/)


* If you want to have this project also in your personal GitHub account also, follow these steps but be **WARNED**: unless you use a "Private" repository, your
```config.js``` will be visible.

  * https://forums.openshift.com/how-to-keep-a-github-repository-and-an-openshift-repository-in-sync
